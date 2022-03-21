#pragma once
#include "json.hpp"
#include "bakkesmod/plugin/bakkesmodplugin.h"

using nlohmann::json;
namespace RT { class Frustum; }

class NameplatesManager
{
public:
    void GetNameplateInfo(CanvasWrapper canvas, CameraWrapper camera, ServerWrapper server, json& nameplatesState);

private:
    //FOV: Anything above 90 degrees remains at 1.0
	//DISTANCE: Anything above 10,000 cm remains at 9.0
	const float FOVMin = 0.1f; //0 degrees
	const float FOVMax = 1.0f; //90 degrees
	const float distMin = 0.5f; //0 centimeters
	const float distMax = 9.0f; //10,000 centimeters
    void GetIndividualNameplate(CanvasWrapper canvas, CameraWrapper camera, RT::Frustum &frustum, CarWrapper car, json& nameplatesState);
    float GetBallVerticalRadius(CanvasWrapper canvas, BallWrapper ball, CameraWrapper camera, RT::Frustum &frustum);
};
