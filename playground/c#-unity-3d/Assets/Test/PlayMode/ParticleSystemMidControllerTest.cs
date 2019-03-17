using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace Tests
{
    public class ParticleSystemMidControllerTest
    {
        ParticleSystemMidController particleSystemMidController;

        [UnityTest]
        public IEnumerator particleSystemConeTest()
        {
            GameObject newGameObject = InstantiateGameObjectParticleSystemMidController();
            yield return null;
            particleSystemMidController = newGameObject.GetComponent<ParticleSystemMidController>();
            particleSystemMidController.shapeCone();
            var shape = particleSystemMidController.particleSystem.shape;
            Assert.AreEqual(ParticleSystemShapeType.Cone, shape.shapeType);
            Assert.AreEqual(ParticleSystemMidController.ANGLE, shape.angle);
            Assert.AreEqual(ParticleSystemMidController.CONE_RADIUS, shape.radius);
        }

        [UnityTest]
        public IEnumerator particleSystemEdgeTest()
        {
            GameObject newGameObject = InstantiateGameObjectParticleSystemMidController();
            yield return null;
            particleSystemMidController = newGameObject.GetComponent<ParticleSystemMidController>();
            particleSystemMidController.shapeEdge();
            var shape = particleSystemMidController.particleSystem.shape;
            Assert.AreEqual(ParticleSystemShapeType.SingleSidedEdge, shape.shapeType);
            Assert.AreEqual(ParticleSystemMidController.ANGLE, shape.angle);
            Assert.AreEqual(ParticleSystemMidController.EDGE_RADIUS, shape.radius);
        }

        [UnityTest]
        public IEnumerator particleSystemRateOverTime1000Test()
        {
            int rate = 1000;
            GameObject newGameObject = InstantiateGameObjectParticleSystemMidController();
            yield return null;
            particleSystemMidController = newGameObject.GetComponent<ParticleSystemMidController>();
            particleSystemMidController.setEmissionRateOverTime(rate);
            Assert.AreEqual(rate, particleSystemMidController.particleSystem.emission.rateOverTime.constantMax);
           
        }

        private GameObject InstantiateGameObjectParticleSystemMidController()
        {
            GameObject newGameObject = new GameObject();
            newGameObject.AddComponent<ParticleSystem>();
            newGameObject.AddComponent<ParticleSystemMidController>();
            Object.Instantiate(newGameObject);
            return newGameObject;
        }
    }
}
