using System;
using UnityEngine;
using UnityEngine.UI;

public class UICanvas : MonoBehaviour
{
    [SerializeField]
    private GameObject particle;
    [SerializeField]
    private Button buttonUpdate;
    [SerializeField]
    private Slider sliderRateOverTime;
    [SerializeField]
    private Toggle toggleEdge;
    [SerializeField]
    private InputField colorStart, colorMid, colorEnd;

    private ParticleSystemController particleSystemController;
    private ParticleSystemMidController particleSystemMidController;
    private ParticleSystemController[] particles;

    private void Start()
    {
        particleSystemMidController = particle.GetComponent<ParticleSystemMidController>();
        particles = (ParticleSystemController[])FindObjectsOfType(typeof(ParticleSystemController));
        buttonUpdate.onClick = new Button.ButtonClickedEvent();
        buttonUpdate.onClick.AddListener(() => clickUpdate());
    }

    private void clickUpdate()
    {
        shape();
        particleSystemMidController.setEmissionRateOverTime(Convert.ToInt32(sliderRateOverTime.value));
        foreach (ParticleSystemController particle in particles)
        {
            particle.alterColorOverLifeTime(Support.convertStringColor(colorStart.text), Support.convertStringColor(colorMid.text), Support.convertStringColor(colorEnd.text));
        }
    }

    private void shape()
    {
        if (toggleEdge.isOn)
            particleSystemMidController.shapeEdge();
        else
            particleSystemMidController.shapeCone();
    }
}
