using UnityEngine;

public class ParticleSystemController : MonoBehaviour
{
    private ParticleSystem particleSystem;

    void Start()
    {
        particleSystem = GetComponent<ParticleSystem>();
        initialColorOverLifeTime();
        shapeCone();
    }

    public void shapeCone()
    {
        var shape = particleSystem.shape;
        shape.shapeType = ParticleSystemShapeType.Cone;
        shape.angle = 10;
        shape.radius = 0.3f;
        setRotationX(-90);
    }

    public void shapeEdge()
    {
        var shape = particleSystem.shape;
        shape.shapeType = ParticleSystemShapeType.SingleSidedEdge;
        shape.radius = 2;
        setRotationX(0);
    }

    private void setRotationX(int x)
    {
        transform.rotation = Quaternion.Euler(x, 0, 0);
    }

    private void initialColorOverLifeTime()
    {
        var colorOverLifeTime = particleSystem.colorOverLifetime;
        Gradient gradient = new Gradient();
        gradient.SetKeys(new GradientColorKey[] { new GradientColorKey(Color.yellow, 0.0f), new GradientColorKey(Color.red, 0.5f), new GradientColorKey(Color.black, 1.0f) }, new GradientAlphaKey[] { new GradientAlphaKey(1.0f, 0f), new GradientAlphaKey(1.0f, 0.5f), new GradientAlphaKey(1.0f, 1.0f) });
        colorOverLifeTime.color = gradient;
    }

    public void setEmissionRateOverTime(int rateOverTime)
    {
        var emission = particleSystem.emission;
        emission.rateOverTime = rateOverTime;
    }
    
    public void alterColorOverLifeTime(Color colorStart, Color colorMid, Color colorEnd)
    {
        var colorOverLifeTime = particleSystem.colorOverLifetime;
        Gradient gradient = new Gradient();
        gradient.SetKeys(new GradientColorKey[] { new GradientColorKey(colorStart, 0.0f), new GradientColorKey(colorMid, 0.5f), new GradientColorKey(colorEnd, 1.0f) }, new GradientAlphaKey[] { new GradientAlphaKey(1.0f, 0f), new GradientAlphaKey(1.0f, 0.5f), new GradientAlphaKey(1.0f, 1.0f) });
        colorOverLifeTime.color = gradient;
    }

}
