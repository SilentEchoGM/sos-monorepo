#include "SOS.h"
#include "utils/parser.h"
#include <sstream>

void SOS::DebugRender(CanvasWrapper canvas)
{
    if(!*bEnableDebugRendering) { return; }

    //This vector will store all the text and colors for each string to be printed
    std::vector<DebugText> TextVector;


    ////////// BEGIN FILL TEXTVECTOR //////////

    //Get the current time
    TextVector.push_back({"Time: " + to_string_with_precision<float>(Clock->GetTime(false), 1)});

    ////////// END FILL TEXTVECTOR //////////


    //Draw all the strings
    DrawTextVector(canvas, Vector2{50,50}, TextVector);
}

void SOS::DrawTextVector(CanvasWrapper Canvas, Vector2 StartPosition, const std::vector<DebugText>& TextVector)
{
    for(const auto& Text : TextVector)
    {
        Canvas.SetPosition(StartPosition);
        Canvas.SetColor(Text.Color);
        Canvas.DrawString(Text.Text);

        StartPosition.Y += 20;
    }
}
