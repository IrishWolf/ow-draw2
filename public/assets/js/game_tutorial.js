function startHomeIntro(firstTime){
  if(firstTime){
    var intro = introJs();
      intro.setOptions({
        steps: [
          {
            intro: "Willkommen zu unserer online Version von Pictionary/Montagsmaler. Da dies dein erster Besuch hier ist, werde wir fix ein paar Dinge durchgehen, damit du weißt wie das ganze funktioniert. Wenn du das ganze Wiederholen möchtest, kannst du jederzeit auf 'Tutorial' klicken (rechts oben)."
          },
          {
            element: '.step1',
            intro: "Gebe hier deinen Namen/Nick ein.",
            position: 'right'
          },
          {
            element: '.step2',
            intro: "Wenn dir die Nummer der Lobby bekannt ist, gib sie hier ein und Klicke auf 'Beitreten'.",
            position: 'right'
          },
          {
            element: '.step3',
            intro: 'Du kannst natürlich auch jederzeit eine eigene Lobby aufmachen.',
            position: 'right'
          }
        ]
      });
      intro.start();
  }
  else{
    console.log(firstTime);
    var intro = introJs();
      intro.setOptions({
        steps: [
          {
            element: '.step1',
            intro: "Gebe hier deinen Namen/Nick ein.",
            position: 'right'
          },
          {
            element: '.step2',
            intro: "Wenn dir die Nummer der Lobby bekannt ist, gib sie hier ein und Klicke auf 'Beitreten'.",
            position: 'right'
          },
          {
            element: '.step3',
            intro: 'Du kannst natürlich auch jederzeit eine eigene Lobby aufmachen.',
            position: 'right'
          }
        ]
      });
      intro.start();
  }
}
function startGuesserIntro(){
  var intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: "Du rätst dieses Mal. Du erhälst 5 Punkte, wenn du als erstes das Wort errätst, Zwei Punkte, wenn du es als Zweites errätst bevor die Zeit abgelaufen ist."
        },
        {
          element: '.guesser-step1',
          intro: "Schreibe deine Vermutung einfach in den Chat.",
          position: 'left'
        },
        {
          element: '.guesser-step2',
          intro: "Die _ zeigen die dir Zeichenanzahl.",
          position: 'right'
        },
        {
          element: '.guesser-step3',
          intro: "Das ist die verbleibende Zeit.",
          position: 'right'
        }
      ]
    });
    intro.start();
}
function startDrawerIntro(){
  var intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: "Jetzt darfst du zeichnen. Du erhälst jedes mal einen Punkt, wenn dein Meisterwerk korrekt erraten wurde. Du verlierst jedoch 2 Punkte, wenn niemand es herausfinden konnte.",
        },
        {
          element: '.drawer-step1',
          intro: "Dies ist das Wort, welches du zeichnen musst.",
          position: 'bottom'
        },
        {
          element: '.drawer-step2',
          intro: "Du hast die Auswahl von einer Palette an Farben und Linienstärke.",
          position: 'top'
        },
        {
          element: '.drawer-step3',
          intro: 'Dies ist die Restzeit der Runde.',
          position: 'right'
        }
      ]
    });
    intro.start();
}
function startLobbyIntro(){
  var intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: "Willkommen in der Lobby",
        },
        {
          element: '.lobby-step1',
          intro: "Hier sind deine Mitspieler*innen.",
          position: 'left'
        },
        {
          element: '.lobby-step2',
          intro: "Das ist der Lobby-Chat.",
          position: 'left'
        }
      ]
    });
    intro.start();
}
