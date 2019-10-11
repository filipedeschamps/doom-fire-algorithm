#ifndef FIREWIDGET_H
#define FIREWIDGET_H

#include <QWidget>
#include <QTimer>

class FireWidget : public QWidget
{
    Q_OBJECT
public:
    explicit FireWidget(int w, int h, QWidget *parent = nullptr);
    ~FireWidget();

    QString playPauseString();
    QString CreateDestroyString();
    QString windSpeed();
    QString updateInterval();

protected:
   class Priv;

   Priv *d;
   QTimer *timer;


signals:
   void statusUpdated();

public slots:
   void onTimerUpdate();

   void onPlayPausePressed();
   void onCreateDestroyPressed();

   void onIncreaseWindPressed();
   void onDecreaseWindPressed();

   void onIncreaseIntervalPressed();
   void onDecreaseIntervalPressed();

   // QWidget interface
protected:
   void resizeEvent(QResizeEvent *event);
   void paintEvent(QPaintEvent *event);

};

#endif // FIREWIDGET_H
