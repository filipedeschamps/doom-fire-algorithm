package com.example.leonardo.doomflames

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.SeekBar
import com.example.leonardo.doomflames.custom.DoomFlamesWidget
import kotlinx.android.synthetic.main.activity_flames.*

class FlamesActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_flames)
        setOnClickListeners()
        setSeekBarListener()
    }

    private fun setSeekBarListener() {
        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                flames.setFlameIntensity(progress*4)
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {}

            override fun onStopTrackingTouch(seekBar: SeekBar?) {}

        })
    }

    private fun setOnClickListeners() {
        leftBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.LEFT) }
        noneBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.NONE) }
        rightBtn.setOnClickListener { flames.setWind(DoomFlamesWidget.WindDirection.RIGHT) }
    }
}
