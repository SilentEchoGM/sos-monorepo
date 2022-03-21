#pragma once
#include "bakkesmod/plugin/bakkesmodplugin.h"

class BallSpeedManager
{
public:
    BallSpeedManager(std::shared_ptr<GameWrapper> InGameWrapper);

    float GetCachedBallSpeed() { return CachedBallSpeed; }
    void LockBallSpeed();
    void UpdateBallSpeed(float NewSpeed);

private:
    BallSpeedManager() = delete; // No default constructor

    std::shared_ptr<GameWrapper> gameWrapper;

    float CachedBallSpeed;
    bool bLocked;

    void UnlockBallSpeed();
};
