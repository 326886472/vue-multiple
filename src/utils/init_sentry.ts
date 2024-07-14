import * as Sentry from '@sentry/vue'

export default function (app: any, extra: any) {
  try {
    Sentry.init({
      dsn: 'https://af64971cd2e58ccb6989767893d50221@sentry.foundingaz.cn/10',
      app,
      debug: ['test', 'development'].includes(import.meta.env.MODE),
      environment: import.meta.env.MODE,
      integrations: [Sentry.extraErrorDataIntegration({ captureErrorCause: true })],
    })

    Sentry.setExtra('customData', extra)

    // app.use(Sentry.vue)
  } catch (err) {
    console.error(err)
  }
}
