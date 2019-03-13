using UnityEngine;

public class ParticleSystemMidController : MonoBehaviour
{
    private ParticleSystem particleSystem;

    private void Start()
    {
        particleSystem = GetComponent<ParticleSystem>();
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

    public void setEmissionRateOverTime(int rateOverTime)
    {
        var emission = particleSystem.emission;
        emission.rateOverTime = rateOverTime;
    }
}
