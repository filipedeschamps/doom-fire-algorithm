package com.example.leonardo.doomflames

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.example.leonardo.doomflames.custom.DoomFlamesWidget
import kotlinx.android.synthetic.main.activity_flames.*

class FlamesActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_flames)
        setOnClickListeners()
    }

    private fun setOnClickListeners() {
        leftBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.LEFT) }
        noneBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.NONE) }
        rightBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.RIGHT) }
    }
}
