#include "firewidget.h"

#include "doomfire.h"

#include <QColor>
#include <QPainter>
#include <QResizeEvent>

#include <QDebug>

class FireWidget::Priv{

public:

    Priv(int w, int h) {
        df = new DoomFire(w, h);
        df->createFire();
        updateInterval = 30;
        fireOn = true;
        fireCreated = true;

        colorTable.push_back(QColor(7, 7, 7).rgb());
        colorTable.push_back(QColor(31, 7, 7).rgb());
        colorTable.push_back(QColor(47, 15, 7).rgb());
        colorTable.push_back(QColor(71, 15, 7).rgb());
        colorTable.push_back(QColor(87, 23, 7).rgb());
        colorTable.push_back(QColor(103, 31, 7).rgb());
        colorTable.push_back(QColor(119, 31, 7).rgb());
        colorTable.push_back(QColor(143, 39, 7).rgb());
        colorTable.push_back(QColor(159, 47, 7).rgb());
        colorTable.push_back(QColor(175, 63, 7).rgb());
        colorTable.push_back(QColor(191, 71, 7).rgb());
        colorTable.push_back(QColor(199, 71, 7).rgb());
        colorTable.push_back(QColor(223, 79, 7).rgb());
        colorTable.push_back(QColor(223, 87, 7).rgb());
        colorTable.push_back(QColor(223, 87, 7).rgb());
        colorTable.push_back(QColor(215, 95, 7).rgb());
        colorTable.push_back(QColor(215, 95, 7).rgb());
        colorTable.push_back(QColor(215, 103, 15).rgb());
        colorTable.push_back(QColor(207, 111, 15).rgb());
        colorTable.push_back(QColor(207, 119, 15).rgb());
        colorTable.push_back(QColor(207, 127, 15).rgb());
        colorTable.push_back(QColor(207, 135, 23).rgb());
        colorTable.push_back(QColor(199, 135, 23).rgb());
        colorTable.push_back(QColor(199, 143, 23).rgb());
        colorTable.push_back(QColor(199, 151, 31).rgb());
        colorTable.push_back(QColor(191, 159, 31).rgb());
        colorTable.push_back(QColor(191, 159, 31).rgb());
        colorTable.push_back(QColor(191, 167, 39).rgb());
        colorTable.push_back(QColor(191, 167, 39).rgb());
        colorTable.push_back(QColor(191, 175, 47).rgb());
        colorTable.push_back(QColor(183, 175, 47).rgb());
        colorTable.push_back(QColor(183, 183, 47).rgb());
        colorTable.push_back(QColor(183, 183, 55).rgb());
        colorTable.push_back(QColor(207, 207, 111).rgb());
        colorTable.push_back(QColor(223, 223, 159).rgb());
        colorTable.push_back(QColor(239, 239, 199).rgb());
        colorTable.push_back(QColor(255, 255, 255).rgb());
    }

    ~Priv() {
        delete df;
    }

    QVector<QRgb> colorTable;

    DoomFire *df;
    int updateInterval;
    bool fireOn;
    bool fireCreated;
};


FireWidget::FireWidget(int w, int h, QWidget *parent) : QWidget(parent)
{
    d = new Priv(w, h);

    timer = new QTimer(this);
    connect(timer, &QTimer::timeout, this, &FireWidget::onTimerUpdate);
    timer->start(d->updateInterval);
}

FireWidget::~FireWidget()
{
    delete d;
}

QString FireWidget::playPauseString()
{
    return d->fireOn ? QString("Pause") : QString("Play");
}

QString FireWidget::CreateDestroyString()
{
    return d->fireCreated ? QString("Destroy") : QString("Create");
}

QString FireWidget::windSpeed()
{
    return QString("%1").arg(d->df->windSpeed());
}

QString FireWidget::updateInterval()
{
    return QString("%1").arg(d->updateInterval);
}

void FireWidget::paintEvent(QPaintEvent *event)
{
    QWidget::paintEvent(event);

    QImage img(d->df->getAlignedFireVector(), d->df->witdh(), d->df->height(), QImage::Format_Indexed8);
    img.setColorTable(d->colorTable);

    QPainter p(this);
    p.drawImage(QPoint(0, 0), img);
}

void FireWidget::onTimerUpdate()
{
    d->df->propagateFire();
    update();
}

void FireWidget::onPlayPausePressed()
{
    if (d->fireOn) {
        timer->stop();
        d->fireOn = false;
    }
    else {
        timer->start(d->updateInterval);
        d->fireOn = true;
    }
    emit statusUpdated();
    update();
}

void FireWidget::onCreateDestroyPressed()
{
    if (d->fireCreated) {
        d->df->destroyFire();
        d->fireCreated = false;
    }
    else {
        d->df->createFire();
        d->fireCreated = true;
    }
    emit statusUpdated();
}

void FireWidget::onIncreaseWindPressed()
{
    d->df->increaseWindSpeed();
    emit statusUpdated();
}

void FireWidget::onDecreaseWindPressed()
{
    d->df->decreaseWindSpeed();
    emit statusUpdated();
}

void FireWidget::onIncreaseIntervalPressed()
{
    if (d->updateInterval < 100) {
        d->updateInterval += 5;
        timer->setInterval(d->updateInterval);
    }
    emit statusUpdated();
}

void FireWidget::onDecreaseIntervalPressed()
{
    if (d->updateInterval > 5) {
        d->updateInterval -= 5;
        timer->setInterval(d->updateInterval);
    }
    emit statusUpdated();
}

void FireWidget::resizeEvent(QResizeEvent *event)
{
    int w = event->size().width();
    int h = event->size().height();
    d->df->resize(w, h);
    emit statusUpdated();
}
