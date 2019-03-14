using UnityEngine;
using System;

public static class Support 
{
    public static Color convertStringColor(string colorRGB)
    {
        string[] rgb = colorRGB.Split(',');
        Color color;
        try
        {
            color = new Color(Convert.ToInt32(rgb[0]), Convert.ToInt32(rgb[1]), Convert.ToInt32(rgb[2]));
        }
        catch (Exception e)
        {
            return Color.white;
        }
        return color;
    }
}
