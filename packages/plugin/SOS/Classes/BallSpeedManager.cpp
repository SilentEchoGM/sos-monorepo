#include "BallSpeedManager.h"

BallSpeedManager::BallSpeedManager(std::shared_ptr<GameWrapper> InGameWrapper)
    : gameWrapper(InGameWrapper), CachedBallSpeed(0.f), bLocked(false) {}

void BallSpeedManager::LockBallSpeed()
{
    bLocked = true;

    gameWrapper->SetTimeout(std::bind(&BallSpeedManager::UnlockBallSpeed, this), 2.f);
}

void BallSpeedManager::UnlockBallSpeed()
{
    bLocked = false;
}

void BallSpeedManager::UpdateBallSpeed(float NewSpeed)
{
    if(!bLocked)
    {
        CachedBallSpeed = NewSpeed;
    }
}
