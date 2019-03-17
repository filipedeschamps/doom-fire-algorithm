using NUnit.Framework;
using UnityEngine;

namespace Tests
{
    public class SupportTest
    {
        [Test]
        public void convertStringForColorTest()
        {
            Color color_0_0_0 = Support.convertStringColor("0,0,0");
            Assert.AreEqual(Color.black, color_0_0_0);
            Color color_0_0_1 = Support.convertStringColor("0,0,1");
            Assert.AreEqual(Color.blue, color_0_0_1);
            Color color_1_0_0 = Support.convertStringColor("1,0,0");
            Assert.AreEqual(Color.red, color_1_0_0);
            Color color_0_1_0 = Support.convertStringColor("0,1,0");
            Assert.AreEqual(Color.green, color_0_1_0);
            Color color_1_1_1 = Support.convertStringColor("1,1,1");
            Assert.AreEqual(Color.white, color_1_1_1);
        }

        [Test]
        public void convertWrongStringForColorWhiteTest()
        {
            Color color_wrong = Support.convertStringColor(",0,0");
            Assert.AreEqual(Color.white, color_wrong);
            color_wrong = Support.convertStringColor("1,1");
            Assert.AreEqual(Color.white, color_wrong);
            color_wrong = Support.convertStringColor("0,0");
            Assert.AreEqual(Color.white, color_wrong);
            color_wrong = Support.convertStringColor("");
            Assert.AreEqual(Color.white, color_wrong);
            color_wrong = Support.convertStringColor("red");
            Assert.AreEqual(Color.white, color_wrong);
        }
    }
}
