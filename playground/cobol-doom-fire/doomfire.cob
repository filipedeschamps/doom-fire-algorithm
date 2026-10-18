       IDENTIFICATION DIVISION.
       PROGRAM-ID. DOOM-FIRE.
       AUTHOR. Harshit-Dhanwalkar.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CONSTANTS.
           05  W               PIC 9(3) VALUE 80.
           05  H               PIC 9(3) VALUE 24.
           05  MAX-HEAT        PIC 9(2) VALUE 36.
           05  FRAME-DELAY     PIC 9(8) VALUE 1000000.

       01  WS-GRID.
           05  FIRE-GRID       PIC 9(2) OCCURS 1920 TIMES.
           05  GRID-INDEX      PIC 9(4).
           05  SRC-INDEX       PIC 9(4).
           05  DST-INDEX       PIC 9(4).

       01  WS-LOOP-VARS.
           05  X               PIC 9(3).
           05  Y               PIC 9(3).
           05  I               PIC 9(8).
           05  SRC-HEAT        PIC 9(2).
           05  DECAY           PIC 9(2).
           05  DST-X           PIC S9(3).
           05  HEAT            PIC 9(2).
           05  RAND-VAL        PIC 9(2).
           05  RAND-SEED       PIC 9(8).

       01  WS-RENDER.
           05  WS-CHAR         PIC X.

       PROCEDURE DIVISION.
       MAIN-PARA.
           ACCEPT RAND-SEED FROM TIME
           COMPUTE RAND-VAL = FUNCTION RANDOM(RAND-SEED)

           PERFORM INIT-PARA
           DISPLAY X"1B" "[2J" X"1B" "[H" NO ADVANCING

           PERFORM UNTIL EXIT
               PERFORM PROPAGATE-PARA
               PERFORM RENDER-PARA
               PERFORM DELAY-PARA
           END-PERFORM
           STOP RUN.

       INIT-PARA.
           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 1920
               MOVE 0 TO FIRE-GRID(I)
           END-PERFORM

           COMPUTE GRID-INDEX = (H - 1) * W + 1
           PERFORM VARYING X FROM 1 BY 1 UNTIL X > W
               MOVE MAX-HEAT TO FIRE-GRID(GRID-INDEX)
               ADD 1 TO GRID-INDEX
           END-PERFORM.

       PROPAGATE-PARA.
           PERFORM VARYING Y FROM H BY -1 UNTIL Y < 2
               PERFORM VARYING X FROM 1 BY 1 UNTIL X > W
                   COMPUTE SRC-INDEX = (Y - 1) * W + X
                   MOVE FIRE-GRID(SRC-INDEX) TO SRC-HEAT

                   COMPUTE RAND-VAL = FUNCTION RANDOM * 3
                   MOVE RAND-VAL TO DECAY

                   COMPUTE RAND-VAL = FUNCTION RANDOM * 3
                   COMPUTE DST-X = X + RAND-VAL - 1

                   IF DST-X < 1
                       MOVE 1 TO DST-X
                   END-IF
                   IF DST-X > W
                       MOVE W TO DST-X
                   END-IF

                   COMPUTE DST-INDEX = (Y - 2) * W + DST-X

                   IF SRC-HEAT > DECAY
                       COMPUTE FIRE-GRID(DST-INDEX) = SRC-HEAT - DECAY
                   ELSE
                       MOVE 0 TO FIRE-GRID(DST-INDEX)
                   END-IF
               END-PERFORM
           END-PERFORM.

       RENDER-PARA.
           DISPLAY X"1B" "[H" NO ADVANCING
           PERFORM VARYING Y FROM 1 BY 1 UNTIL Y > H
               PERFORM VARYING X FROM 1 BY 1 UNTIL X > W
                   COMPUTE GRID-INDEX = (Y - 1) * W + X
                   MOVE FIRE-GRID(GRID-INDEX) TO HEAT

                   EVALUATE TRUE
                       WHEN HEAT > 30 MOVE '#' TO WS-CHAR
                       WHEN HEAT > 20 MOVE '*' TO WS-CHAR
                       WHEN HEAT > 10 MOVE '.' TO WS-CHAR
                       WHEN HEAT > 5  MOVE ':' TO WS-CHAR
                       WHEN OTHER     MOVE ' ' TO WS-CHAR
                   END-EVALUATE

                   DISPLAY WS-CHAR NO ADVANCING
               END-PERFORM
               DISPLAY X"0D0A" NO ADVANCING
           END-PERFORM.

       DELAY-PARA.
           PERFORM VARYING I FROM 1 BY 1 UNTIL I > FRAME-DELAY
               CONTINUE
           END-PERFORM.
