       IDENTIFICATION DIVISION.
       PROGRAM-ID. DOOM-FIRE.
       AUTHOR. Harshit-Dhanwalkar.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CONSTANTS.
           05  W               PIC 9(3) VALUE 80.
           05  H               PIC 9(3) VALUE 24.
           05  MAX-HEAT        PIC 9(2) VALUE 36.
           05  FRAME-DELAY     PIC 9(8) VALUE 500000.
           *> -1 lean left, 0 is straight up, 1 is right
           05  DRIFT           PIC S9(2) VALUE -1.

       01  WS-GRID.
           05  FIRE-GRID       PIC 9(2) OCCURS 1920 TIMES.
           05  GRID-INDEX      PIC 9(4).
           05  SRC-INDEX       PIC 9(4).
           05  DST-INDEX       PIC 9(4).

       01  WS-LOOP-VARS.
           05  X               PIC 9(3).
           05  Y               PIC 9(3).
           05  I               PIC 9(8).
           05  DUMMY           PIC 9(18) VALUE 0.
           05  SRC-HEAT        PIC 9(2).
           05  DECAY           PIC 9(2).
           05  DST-X           PIC S9(3).
           05  HEAT            PIC 9(2).
           05  COLOR-IDX       PIC 9(2).
           05  RAND-VAL        PIC 9(2).
           05  RAND-SEED       PIC 9(8).

       01  WS-RENDER.
           05  WS-CHAR         PIC X.
           05  WS-COLOR-OUT    PIC X(11).
           05  WS-KEY          PIC X.
           05  WS-QUIT         PIC X VALUE 'N'.
           05  COLOR-STR       PIC X(15) OCCURS 37 TIMES.
           05  RESET-STR       PIC X(5).
           05  NEWLINE-STR     PIC X(2).

       *> 256-color palette mapping (Black -> Red -> Orange -> Yellow -> White)
       01  COLOR-PALETTE.
           05 FILLER PIC 9(3) VALUE 016.
           05 FILLER PIC 9(3) VALUE 052.
           05 FILLER PIC 9(3) VALUE 052.
           05 FILLER PIC 9(3) VALUE 088.
           05 FILLER PIC 9(3) VALUE 088.
           05 FILLER PIC 9(3) VALUE 124.
           05 FILLER PIC 9(3) VALUE 124.
           05 FILLER PIC 9(3) VALUE 124.
           05 FILLER PIC 9(3) VALUE 160.
           05 FILLER PIC 9(3) VALUE 160.
           05 FILLER PIC 9(3) VALUE 196.
           05 FILLER PIC 9(3) VALUE 196.
           05 FILLER PIC 9(3) VALUE 196.
           05 FILLER PIC 9(3) VALUE 202.
           05 FILLER PIC 9(3) VALUE 202.
           05 FILLER PIC 9(3) VALUE 202.
           05 FILLER PIC 9(3) VALUE 208.
           05 FILLER PIC 9(3) VALUE 208.
           05 FILLER PIC 9(3) VALUE 214.
           05 FILLER PIC 9(3) VALUE 214.
           05 FILLER PIC 9(3) VALUE 214.
           05 FILLER PIC 9(3) VALUE 220.
           05 FILLER PIC 9(3) VALUE 220.
           05 FILLER PIC 9(3) VALUE 220.
           05 FILLER PIC 9(3) VALUE 226.
           05 FILLER PIC 9(3) VALUE 226.
           05 FILLER PIC 9(3) VALUE 226.
           05 FILLER PIC 9(3) VALUE 227.
           05 FILLER PIC 9(3) VALUE 228.
           05 FILLER PIC 9(3) VALUE 229.
           05 FILLER PIC 9(3) VALUE 230.
           05 FILLER PIC 9(3) VALUE 230.
           05 FILLER PIC 9(3) VALUE 231.
           05 FILLER PIC 9(3) VALUE 231.
           05 FILLER PIC 9(3) VALUE 231.
           05 FILLER PIC 9(3) VALUE 231.
           05 FILLER PIC 9(3) VALUE 231.
       01  COLOR-TABLE REDEFINES COLOR-PALETTE.
           05 COLOR-VAL    PIC 9(3) OCCURS 37 TIMES.

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
           *> Build ANSI escape strings
           PERFORM VARYING I FROM 1 BY 1 UNTIL I > 37
               STRING X"1B" "[38;5;" COLOR-VAL(I) "m" 
                   DELIMITED BY SIZE INTO COLOR-STR(I)
               END-STRING
           END-PERFORM
           STRING X"1B" "[0m" DELIMITED BY SIZE INTO RESET-STR
           STRING X"0D0A" DELIMITED BY SIZE INTO NEWLINE-STR

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
                   COMPUTE DST-X = X + RAND-VAL - 1 + DRIFT

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
                       WHEN HEAT > 30 MOVE '@' TO WS-CHAR
                       WHEN HEAT > 20 MOVE '#' TO WS-CHAR
                       WHEN HEAT > 10 MOVE '*' TO WS-CHAR
                       WHEN HEAT > 5  MOVE '.' TO WS-CHAR
                       WHEN OTHER     MOVE ' ' TO WS-CHAR
                   END-EVALUATE

                   COMPUTE COLOR-IDX = HEAT + 1
                   MOVE COLOR-STR(COLOR-IDX)(1:11) TO WS-COLOR-OUT
                   
                   DISPLAY WS-COLOR-OUT WS-CHAR NO ADVANCING
               END-PERFORM
               DISPLAY RESET-STR(1:4) NEWLINE-STR NO ADVANCING
           END-PERFORM.

       DELAY-PARA.
           PERFORM VARYING I FROM 1 BY 1 UNTIL I > FRAME-DELAY
               COMPUTE DUMMY = DUMMY + 1
           END-PERFORM.
