using UnityEngine;

public class ParticleSystemController : MonoBehaviour
{
    public ParticleSystem particleSystem;

    private void Start()
    {
        particleSystem = GetComponent<ParticleSystem>();
        initialColorOverLifeTime();
    }

    private void initialColorOverLifeTime()
    {
        var colorOverLifeTime = particleSystem.colorOverLifetime;
        Gradient gradient = new Gradient();
        gradient.SetKeys(new GradientColorKey[] { new GradientColorKey(Color.yellow, 0.0f), new GradientColorKey(Color.red, 0.5f), new GradientColorKey(Color.black, 1.0f) }, new GradientAlphaKey[] { new GradientAlphaKey(1.0f, 0f), new GradientAlphaKey(1.0f, 0.5f), new GradientAlphaKey(1.0f, 1.0f) });
        colorOverLifeTime.color = gradient;
    }
    
    public void alterColorOverLifeTime(Color colorStart, Color colorMid, Color colorEnd)
    {
        var colorOverLifeTime = particleSystem.colorOverLifetime;
        Gradient gradient = new Gradient();
        gradient.SetKeys(new GradientColorKey[] { new GradientColorKey(colorStart, 0.0f), new GradientColorKey(colorMid, 0.5f), new GradientColorKey(colorEnd, 1.0f) }, new GradientAlphaKey[] { new GradientAlphaKey(1.0f, 0f), new GradientAlphaKey(1.0f, 0.5f), new GradientAlphaKey(1.0f, 1.0f) });
        colorOverLifeTime.color = gradient;
    }
}
