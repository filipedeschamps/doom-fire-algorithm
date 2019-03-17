using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace Tests
{
    public class ParticleSystemControllerTest
    {
        ParticleSystemController particleSystemController;

        [UnityTest]
        public IEnumerator colorsDifferent()
        {
            GameObject newGameObject = InstantiateGameObjectParticleSystemMidController();
            yield return null;
            particleSystemController = newGameObject.GetComponent<ParticleSystemController>();
            Color[] colors = { Color.red, Color.blue, Color.black };
            particleSystemController.alterColorOverLifeTime(colors[0], colors[1], colors[2]);
            Gradient gradient = getGradient(colors[0], colors[1], colors[2]);
            Assert.AreEqual(gradient, particleSystemController.particleSystem.colorOverLifetime.color.gradient);
        }

        [UnityTest]
        public IEnumerator colorsEqual()
        {
            GameObject newGameObject = InstantiateGameObjectParticleSystemMidController();
            yield return null;
            particleSystemController = newGameObject.GetComponent<ParticleSystemController>();
            Color color = Color.yellow;
            particleSystemController.alterColorOverLifeTime(color, color, color);
            Gradient gradient = getGradient(color, color, color);
            Assert.AreEqual(gradient, particleSystemController.particleSystem.colorOverLifetime.color.gradient);
        }

        private GameObject InstantiateGameObjectParticleSystemMidController()
        {
            GameObject newGameObject = new GameObject();
            newGameObject.AddComponent<ParticleSystem>();
            newGameObject.AddComponent<ParticleSystemController>();
            Object.Instantiate(newGameObject);
            return newGameObject;
        }

        private Gradient getGradient(Color colorStart, Color colorMid, Color colorEnd)
        {
            Gradient gradient = new Gradient();
            gradient.SetKeys(new GradientColorKey[] { new GradientColorKey(colorStart, 0.0f), new GradientColorKey(colorMid, 0.5f), new GradientColorKey(colorEnd, 1.0f) }, new GradientAlphaKey[] { new GradientAlphaKey(1.0f, 0f), new GradientAlphaKey(1.0f, 0.5f), new GradientAlphaKey(1.0f, 1.0f) });
            return gradient;
        }
    }
}
