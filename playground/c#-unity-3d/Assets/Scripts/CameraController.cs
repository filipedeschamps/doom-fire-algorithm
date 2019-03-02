using UnityEngine;

public class CameraController : MonoBehaviour
{
    [SerializeField]
    private Transform player;
    [SerializeField]
    private float distance = 0.1f;

    private const float Y_ANGLE_MIN = -25.0f;
    private const float Y_ANGLE_MAX = 50.0F;
    private float currentX = 0.0f;
    private float currentY = 0.0f;

    void Update()
    {
        currentX += Input.GetAxis("Mouse X");
        currentY += Input.GetAxis("Mouse Y");

        currentY = Mathf.Clamp(currentY, Y_ANGLE_MIN, Y_ANGLE_MAX);
    }

    private void LateUpdate()
    {
        gameObject.transform.position = player.position + Quaternion.Euler(currentY + 10, currentX, 0) * new Vector3(0, 0, distance);
        gameObject.transform.LookAt(player.position);
    }
}
