package com.biachacon.doomfire

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    var f = 9;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setOnClickListeners()
    }

    private fun setOnClickListeners() {

        maxBt.setOnClickListener {
            f = 9
            fire.setFireIntensity(f*4)
        }

        minBt.setOnClickListener {
            f = 1
            fire.setFireIntensity(f*4)
        }

        downBt.setOnClickListener {
            if (f>1) {
                f--
            }

            fire.setFireIntensity(f*4)
        }

        upBt.setOnClickListener {
            if (f<9) {
                f++
            }
            fire.setFireIntensity(f*4)
        }

        noneBt.setOnClickListener {
            fire.setWind(Fire.WindDirection.NONE)
        }

        leftBt.setOnClickListener {
            fire.setWind(Fire.WindDirection.LEFT)
        }

        rightBt.setOnClickListener {
            fire.setWind(Fire.WindDirection.RIGHT)
        }
    }
}