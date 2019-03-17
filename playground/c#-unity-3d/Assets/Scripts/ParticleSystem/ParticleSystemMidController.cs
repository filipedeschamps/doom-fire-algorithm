using UnityEngine;

public class ParticleSystemMidController : MonoBehaviour
{
    public ParticleSystem particleSystem;

    public const int ANGLE = 10;
    public const float CONE_RADIUS = 0.3f;
    public const float EDGE_RADIUS = 2f;

    public void Start()
    {
        particleSystem = GetComponent<ParticleSystem>();
        shapeCone();
    }

    public void shapeCone()
    {
        var shape = particleSystem.shape;
        shape.shapeType = ParticleSystemShapeType.Cone;
        shape.angle = ANGLE;
        shape.radius = CONE_RADIUS;
        setRotationX(-90);
    }

    public void shapeEdge()
    {
        var shape = particleSystem.shape;
        shape.shapeType = ParticleSystemShapeType.SingleSidedEdge;
        shape.radius = EDGE_RADIUS;
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
