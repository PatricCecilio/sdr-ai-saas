type AccessUser = {
  accessStatus: string | null
  trialEndsAt: Date | null
  subscriptionStatus: string | null
}

export function canAccessApp(user: AccessUser) {
  const now = new Date()

  const hasActiveSubscription =
    user.subscriptionStatus === "active" ||
    user.subscriptionStatus === "trialing"

  if (hasActiveSubscription) return true

  const isTrialValid =
    user.accessStatus === "trial" &&
    user.trialEndsAt !== null &&
    user.trialEndsAt > now

  if (isTrialValid) return true

  return false
}