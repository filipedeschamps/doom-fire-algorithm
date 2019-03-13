using UnityEngine;

public class PlayerController : MonoBehaviour
{
    private Transform cam;
    [SerializeField]
    private float speed = 4f;
    [SerializeField]
    private float turnSpeed = 9f;

    private Rigidbody rigiBody;

    private void Start()
    {
        rigiBody = GetComponent<Rigidbody>();
        cam = Camera.main.transform;
        rigiBody.freezeRotation = true;
    }

    private void FixedUpdate()
    {
        Vector3 direction = (cam.right * Input.GetAxis("Horizontal")) + (cam.forward * Input.GetAxis("Vertical"));

        direction.y = 0;

        if (Input.GetAxis("Horizontal") != 0 || Input.GetAxis("Vertical") != 0)
        {
            rigiBody.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), turnSpeed * Time.deltaTime);
            rigiBody.velocity = transform.forward * speed;
        }
    }
}
