import { text } from '@snowluma/sdk'
import 'dotenv/config'
import { JsBotBasePlugin } from '../../core/plugin/base'

const REPOSITORY = 'jsbot-dev/JsBot-Next'
const POLL_INTERVAL = 150_000
const EVENTS_URL = `https://api.github.com/repos/${REPOSITORY}/events?per_page=100`
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// Replace the placeholder when a notification target is available.
const NOTIFICATION_TARGET = {
    type: 'group' as const,
    id: 1017248143,
}

type GitHubEvent = {
    id: string
    type: string
    actor?: { login?: string }
    repo?: { name?: string }
    created_at?: string
    payload?: Record<string, unknown>
}

export default class GithubPlugin extends JsBotBasePlugin {
    private timer?: NodeJS.Timeout
    private checking = false
    private started = false

    constructor(...args: ConstructorParameters<typeof JsBotBasePlugin>) {
        super(...args)
        this.logger.info(`GitHub API authentication: ${GITHUB_TOKEN ? 'enabled' : 'disabled'}`)
        this.logger.info(`GitHub monitor waiting for WebSocket connection; polling every ${POLL_INTERVAL / 1000}s`)

        this.bot.client.on('open', () => {
            if (this.started) return

            this.started = true
            this.logger.info('GitHub monitor connected; running first poll')
            void this.check()
            this.timer = setInterval(() => void this.check(), POLL_INTERVAL)
        })
    }

    private async check(): Promise<void> {
        if (this.checking) {
            this.logger.debug('Skipping poll because the previous poll is still running')
            return
        }
        this.checking = true
        this.logger.debug('Polling GitHub events')

        try {
            const response = await fetch(EVENTS_URL, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    'User-Agent': 'JsBot-Next-Github-Monitor',
                    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
                },
            })

            if (!response.ok) {
                const body = await response.text()
                throw new Error(`GitHub API returned ${response.status}: ${body}`)
            }

            const events = await response.json() as GitHubEvent[]
            if (!Array.isArray(events)) throw new Error('GitHub API returned invalid events')
            this.logger.debug(`GitHub returned ${events.length} events`)

            const previous = await this.getSeenEvents()
            const seen = new Set(previous)
            const unseen = events.filter((event) => event.id && !seen.has(event.id))

            if (previous.length === 0) {
                await this.saveSeenEvents(events)
                this.logger.info(`Initialized GitHub event baseline with ${events.length} events`)
                return
            }

            for (const event of unseen.reverse()) {
                await this.notify(event)
                seen.add(event.id)
            }

            await this.saveSeenEvents([...seen].slice(-1000))
            if (unseen.length > 0) {
                this.logger.info(`Detected ${unseen.length} new GitHub events`)
            } else {
                this.logger.debug('No new GitHub events')
            }
        } catch (error) {
            this.logger.error(`GitHub polling failed: ${error}`)
        } finally {
            this.checking = false
            this.logger.debug('GitHub polling finished')
        }
    }

    private async getSeenEvents(): Promise<string[]> {
        const value = await this.get_kv('seen-events')
        return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
    }

    private async saveSeenEvents(events: GitHubEvent[] | string[]): Promise<void> {
        const ids = events.map((event) => typeof event === 'string' ? event : event.id).filter(Boolean)
        await this.put_kv('seen-events', ids.slice(-1000))
    }

    private async notify(event: GitHubEvent): Promise<void> {
        const summary = this.formatEvent(event)
        if (NOTIFICATION_TARGET.id === 0) {
            this.logger.info(`[notification placeholder] ${summary}`)
            return
        }

        if (NOTIFICATION_TARGET.type === 'group') {
            this.logger.info(`Sending GitHub notification to group ${NOTIFICATION_TARGET.id}: ${summary}`)
            await this.bot.client.sendGroupMessage(NOTIFICATION_TARGET.id, text(summary))
            this.logger.info(`GitHub notification sent for event ${event.id}`)
        }
    }

    private formatEvent(event: GitHubEvent): string {
        const actor = event.actor?.login ?? 'unknown user'
        const repository = event.repo?.name ?? REPOSITORY
        const action = this.eventAction(event)
        const time = event.created_at ? ` (${event.created_at})` : ''
        return `[GitHub] ${repository}: ${actor} ${action}${time}`
    }

    private eventAction(event: GitHubEvent): string {
        const payload = event.payload ?? {}
        const action = typeof payload.action === 'string' ? ` ${payload.action}` : ''

        switch (event.type) {
            case 'PushEvent': return 'pushed commits'
            case 'ReleaseEvent': return `published a release${action}`
            case 'IssuesEvent': return `updated an issue${action}`
            case 'IssueCommentEvent': return 'commented on an issue or pull request'
            case 'PullRequestEvent': return `updated a pull request${action}`
            case 'PullRequestReviewEvent': return `reviewed a pull request${action}`
            case 'PullRequestReviewCommentEvent': return 'commented on a pull request diff'
            case 'CreateEvent': return `created ${String(payload.ref_type ?? 'a ref')}`
            case 'DeleteEvent': return `deleted ${String(payload.ref_type ?? 'a ref')}`
            case 'ForkEvent': return 'forked the repository'
            case 'WatchEvent': return 'starred the repository'
            default: return `triggered ${event.type}`
        }
    }
}
