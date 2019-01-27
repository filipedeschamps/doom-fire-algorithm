package com.example.leonardo.doomflames.custom

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import com.example.leonardo.doomflames.R
import java.util.*
import kotlin.math.absoluteValue

class DoomFlamesWidget(context: Context, attributeSet: AttributeSet) : View(context, attributeSet) {

    private val fireColorsPalette = arrayOf(
        Paint().apply { color = Color.rgb(7, 7, 7) },
        Paint().apply { color = Color.rgb(31, 7, 7) },
        Paint().apply { color = Color.rgb(47, 15, 7) },
        Paint().apply { color = Color.rgb(71, 15, 7) },
        Paint().apply { color = Color.rgb(87, 23, 7) },
        Paint().apply { color = Color.rgb(103, 31, 7) },
        Paint().apply { color = Color.rgb(119, 31, 7) },
        Paint().apply { color = Color.rgb(143, 39, 7) },
        Paint().apply { color = Color.rgb(159, 47, 7) },
        Paint().apply { color = Color.rgb(175, 63, 7) },
        Paint().apply { color = Color.rgb(191, 71, 7) },
        Paint().apply { color = Color.rgb(199, 71, 7) },
        Paint().apply { color = Color.rgb(223, 79, 7) },
        Paint().apply { color = Color.rgb(223, 87, 7) },
        Paint().apply { color = Color.rgb(223, 87, 7) },
        Paint().apply { color = Color.rgb(215, 95, 7) },
        Paint().apply { color = Color.rgb(215, 95, 7) },
        Paint().apply { color = Color.rgb(215, 95, 7) },
        Paint().apply { color = Color.rgb(215, 103, 15) },
        Paint().apply { color = Color.rgb(207, 111, 15) },
        Paint().apply { color = Color.rgb(207, 119, 15) },
        Paint().apply { color = Color.rgb(207, 127, 15) },
        Paint().apply { color = Color.rgb(207, 135, 23) },
        Paint().apply { color = Color.rgb(199, 135, 23) },
        Paint().apply { color = Color.rgb(199, 143, 23) },
        Paint().apply { color = Color.rgb(199, 151, 31) },
        Paint().apply { color = Color.rgb(191, 159, 31) },
        Paint().apply { color = Color.rgb(191, 159, 31) },
        Paint().apply { color = Color.rgb(191, 167, 39) },
        Paint().apply { color = Color.rgb(191, 167, 39) },
        Paint().apply { color = Color.rgb(191, 175, 47) },
        Paint().apply { color = Color.rgb(183, 175, 47) },
        Paint().apply { color = Color.rgb(183, 183, 47) },
        Paint().apply { color = Color.rgb(183, 183, 55) },
        Paint().apply { color = Color.rgb(207, 207, 111) },
        Paint().apply { color = Color.rgb(223, 223, 159) },
        Paint().apply { color = Color.rgb(239, 239, 199) },
        Paint().apply { color = Color.rgb(255, 255, 255) }
    )

    private val widthResolution = 480

    private var widthMode: Int = 0
    private var widthSize: Int = 0
    private var heightMode: Int = 0
    private var heightSize: Int = 0

    private var widthPixel: Int = 0
    private var heightPixel: Int = 0
    private var pixelSize: Int = 0
    private var windDirection: Int = 0

    private lateinit var flamesArray: IntArray

    init {
        with(context.obtainStyledAttributes(attributeSet, R.styleable.DoomFlamesWidget)) {
            windDirection = getInt(R.styleable.DoomFlamesWidget_wind, 0)
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        widthMode = View.MeasureSpec.getMode(widthMeasureSpec)
        widthSize = View.MeasureSpec.getSize(widthMeasureSpec)
        heightMode = View.MeasureSpec.getMode(heightMeasureSpec)
        heightSize = View.MeasureSpec.getSize(heightMeasureSpec)
        initializeFlamesArray()
        createFireSource()
    }

    private fun getWidthCalculated(): Int {
        return when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> Math.min(widthResolution, widthSize)
            else -> widthResolution
        }
    }

    private fun getHeightCalculated(): Int {
        return when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> Math.min(widthResolution, heightPixel)
            else -> widthResolution
        }
    }

    private fun initializeFlamesArray() {
        val heightIsBigger = getWidthCalculated() < getHeightCalculated()
        val biggestSize = if (heightIsBigger) getWidthCalculated().toDouble() else getHeightCalculated().toDouble()
        pixelSize = Math.ceil( biggestSize / 50).toInt()
        widthPixel = if (heightIsBigger) 50 else Math.ceil(getWidthCalculated().toDouble()/pixelSize).toInt()
        heightPixel = if (!heightIsBigger) 50 else Math.ceil(getHeightCalculated().toDouble()/pixelSize).toInt()
        val arraySize = widthPixel * heightPixel
        flamesArray = IntArray(arraySize.absoluteValue)
        flamesArray.forEachIndexed { index, _ -> flamesArray[index] = 0 }
    }

    private fun createFireSource(firePower: Int = 36) {
        val overFlowFireIndex = widthPixel * heightPixel

        for (column in 0 until widthPixel) {
            val pixelIndex = (overFlowFireIndex - widthPixel) + column
            flamesArray[pixelIndex] = firePower
        }
    }

    private fun calculateFirePropagation() {
        for (column in 0 until widthPixel) {
            for (row in 0 until heightPixel) {
                updateFireIntensityPerPixel(column + (widthPixel * row))
            }
        }
    }


    private fun updateFireIntensityPerPixel(currentPixelIndex: Int) {
        val bellowPixelIndex = currentPixelIndex + widthPixel
        if (bellowPixelIndex >= widthPixel * heightPixel) return

        val heightIsBigger = getWidthCalculated() < getHeightCalculated()
        val decay = Math.floor(Random().nextDouble() * if (heightIsBigger)2 else 3).toInt()
        val bellowPixelFireIntensity = flamesArray[bellowPixelIndex]
        val newFireIntensity = if (bellowPixelFireIntensity - decay >= 0) bellowPixelFireIntensity - decay else 0
        val pos = when(windDirection){
            1 -> if (currentPixelIndex - decay >= 0) currentPixelIndex - decay else currentPixelIndex
            2 -> if (currentPixelIndex + decay >= 0) currentPixelIndex + decay else currentPixelIndex
            else -> currentPixelIndex
        }
        flamesArray[pos] = newFireIntensity
    }

    private fun renderFire(canvas: Canvas) {
        for (row in 0 until heightPixel) {
            for (column in 0 until widthPixel) {
                canvas.drawRect(
                    (column * pixelSize).toFloat(),
                    (row * pixelSize).toFloat(),
                    ((column + 1) * pixelSize).toFloat(),
                    ((row + 1) * pixelSize).toFloat(),
                    fireColorsPalette[flamesArray[column + (widthPixel * row)]]
                )
            }
        }
    }

    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
        calculateFirePropagation()
        canvas?.let { renderFire(it) }
        postInvalidateDelayed(13)
    }

    fun setWind(direction: WindDirection){
        windDirection = direction.value
    }

    fun setFlameIntensity(int: Int){
        createFireSource(int)
        invalidate()
    }

    enum class WindDirection(val value:Int){
        RIGHT(2), LEFT(1), NONE(0)
    }
}