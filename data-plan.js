"use strict";
/* Zahi Fit v4.6 — bodyweight exercise library + exercise pools used by the programme builder.
   Loaded after data.js and data-de.js. */

/* E(name, block, sets, reps, rest, cue, video, how, mistakes, subs) */
const BODYWEIGHT = [
E("Bodyweight Squat","Strength",4,"12–15",60,"Sit between your hips, keep the chest tall and stand by pushing the floor away.","",["Feet shoulder-width, toes slightly out","Knees track over the toes","Slow 3-second lowering"],["Heels lifting","Knees caving inward"],["Reverse Lunge","Bodyweight Split Squat"]),
E("Jump Squat","Power",4,"8",60,"Quick dip, explode up, land softly and reset before the next jump.","",["Quarter-squat dip","Drive through the whole foot","Land quietly with soft knees"],["Landing stiff-legged","Knees caving on landing"],["Bodyweight Squat","Burpee Intervals"]),
E("Single-Leg Romanian Deadlift","Hypertrophy",3,"8/leg",60,"Hinge on one leg with a long spine; hips stay square to the floor.","",["Soft standing knee","Hips travel back","Back leg and torso move as one"],["Rounding the back","Hips opening to the side"],["Single-Leg Glute Bridge","Reverse Lunge"]),
E("Reverse Lunge","Strength",3,"10/leg",60,"Step back, lower the back knee under control and drive up through the front foot.","",["Long step back","Front foot stays planted","Torso tall"],["Front knee collapsing","Pushing off the back foot"],["Bodyweight Split Squat","Bodyweight Squat"]),
E("Bodyweight Split Squat","Hypertrophy",3,"10/leg",60,"Stay in a split stance and move straight up and down with a slow lowering.","",["Staggered, hip-width stance","Lower straight down","Drive through the front heel"],["Short, narrow stance","Leaning far forward"],["Reverse Lunge","Step-Down Control"]),
E("Push-up","Strength",4,"8–15",75,"Hands under the shoulders, body in one straight line, chest to just above the floor.","",["Brace glutes and trunk","Elbows about 45° from the body","Full range, chest to floor height"],["Hips sagging","Half-range reps"],["Chair Dips","Pike Push-up"]),
E("Pike Push-up","Hypertrophy",3,"6–10",75,"Hips high in an inverted V; lower the head toward the floor between the hands.","",["Hips stacked high","Head travels forward of the hands","Press back to the V"],["Elbows flaring wide","Hips dropping into a plank"],["Push-up","Chair Dips"]),
E("Inverted Row","Strength",4,"8–12",75,"Under a sturdy table or low bar, pull your chest up with a straight body.","",["Grip just wider than shoulders","Body straight from heels to head","Pull chest to the edge"],["Hips sagging","Shrugging the shoulders"],["Prone Y-T-W Raise","Push-up"]),
E("Prone Y-T-W Raise","Durability",3,"8 each",45,"Lying face down, lift the arms into Y, T and W shapes by squeezing the shoulder blades.","",["Thumbs up, neck long","Squeeze shoulder blades together","Pause 1–2 seconds at the top"],["Arching the lower back","Lifting the head"],["Inverted Row","Plank"]),
E("Chair Dips","Hypertrophy",3,"8–12",60,"Hands on a stable chair behind you; lower until the upper arms are about parallel.","",["Chair against a wall","Shoulders down, chest open","Elbows point straight back"],["Dropping too deep","Shoulders rolling forward"],["Push-up","Pike Push-up"]),
E("Single-Leg Glute Bridge","Hypertrophy",3,"10/leg",45,"Drive through one heel and lift the hips until the body is straight from shoulder to knee.","",["Heel close to the glutes","Ribs down","Squeeze and pause at the top"],["Arching the lower back","Hips tilting to one side"],["Single-Leg Romanian Deadlift","Bodyweight Squat"]),
E("Plank","Durability",3,"30–45 sec",45,"Forearms under shoulders, one straight line from head to heels, breathe calmly.","",["Squeeze glutes","Ribs pulled down","Push the floor away"],["Hips sagging","Holding your breath"],["Dead Bug","Side Plank"]),
E("Side Plank","Durability",2,"30 sec/side",30,"Elbow under shoulder, hips lifted, body in a straight line from head to feet.","",["Stack or stagger the feet","Hips high and forward","Top arm long or on hip"],["Hips dropping","Rolling backwards"],["Plank","Dead Bug"]),
E("Dead Bug","Durability",3,"8/side",45,"Lower back pressed down; slowly extend the opposite arm and leg without losing position.","",["Knees above hips, arms to ceiling","Exhale as you extend","Move slowly, back stays flat"],["Lower back arching","Rushing the reps"],["Plank","Side Plank"]),
E("Burpee Intervals","Conditioning",8,"30 s work / 30 s easy",0,"Smooth, repeatable burpees; step back instead of jumping if needed.","",["Hands down, jump or step back","Chest down, push up","Stand and small jump"],["Racing the first rounds","Hips sagging in the plank"],["High-Knee Intervals","Bodyweight Engine Circuit"]),
E("High-Knee Intervals","Conditioning",8,"30 s fast / 30 s march",0,"Drive the knees to hip height with quick, light feet; recover by marching.","",["Stay tall","Land on the balls of the feet","Arms pump in rhythm"],["Leaning back","Heavy, loud landings"],["Burpee Intervals","Brisk Walk or Easy Jog"]),
E("Bodyweight Engine Circuit","Conditioning",5,"10 squats / 8 push-ups / 10 reverse lunges / 20 s plank",60,"Steady pace; every rep as clean as in round one.","",["Pace round one conservatively","Move cleanly between stations","Breathe fully"],["Racing the first round","Sloppy reps when tired"],["Burpee Intervals","High-Knee Intervals"]),
E("Brisk Walk or Easy Jog","Conditioning",1,"25–35 min",0,"Conversational pace: breathing harder but you could still talk in sentences.","",["Tall posture","Relaxed shoulders","Steady rhythm"],["Starting too fast","Shuffling with a slumped posture"],["High-Knee Intervals","Bodyweight Engine Circuit"])
];
BODYWEIGHT.forEach(x => { x.bw = true; });
EXTRA.push(...BODYWEIGHT);
const HOLD_EXERCISES = new Set(["Plank","Side Plank"]);
const BW_NAMES = new Set(BODYWEIGHT.map(x => x.n));

Object.assign(FAMILY, {
  "Bodyweight Squat":"bwSquat", "Jump Squat":"jumpSquat", "Single-Leg Romanian Deadlift":"slRdl", "Reverse Lunge":"revLunge",
  "Bodyweight Split Squat":"bwSplit", "Push-up":"pushup", "Pike Push-up":"pike", "Inverted Row":"invRow", "Prone Y-T-W Raise":"ytw",
  "Chair Dips":"dips", "Single-Leg Glute Bridge":"slBridge", "Plank":"plank", "Side Plank":"sidePlank", "Dead Bug":"deadBug",
  "Burpee Intervals":"burpee", "High-Knee Intervals":"highKnee", "Bodyweight Engine Circuit":"bwCircuit", "Brisk Walk or Easy Jog":"walkJog"
});


Object.assign(STEPS, {
  bwSquat:[["Set your stance","Stand shoulder-width with toes slightly turned out and arms forward for balance."],["Brace","Take a breath and tighten the trunk before you move."],["Lower slowly","Sit between the hips for about three seconds, knees tracking over the toes, heels down."],["Reach depth","Go as deep as you can with a tall chest and flat feet."],["Stand up","Push the floor away and finish tall with the glutes squeezed."]],
  jumpSquat:[["Set your stance","Feet shoulder-width, arms ready to swing."],["Quick dip","Drop into a quarter squat with the chest up."],["Explode","Drive through the whole foot and swing the arms up as you jump."],["Land softly","Land quietly through the balls of the feet into bent knees."],["Reset","Stand tall, find your balance and go again."]],
  slRdl:[["Stand on one leg","Soft knee on the standing leg, hands at the hips or reaching forward."],["Hinge back","Send the hips back while the free leg reaches behind you."],["Keep it square","Torso and back leg move as one straight line; hips face the floor."],["Feel the hamstring","Stop when the standing hamstring limits the range."],["Return","Drive the hips forward to stand tall, then repeat."]],
  revLunge:[["Stand tall","Feet hip-width, hands at the hips or in front."],["Step back","Take a long step back and land on the ball of the foot."],["Lower","Drop the back knee toward the floor; the front knee stays over the foot."],["Drive up","Push through the whole front foot to return to standing."],["Alternate","Repeat on the other leg with the same control."]],
  bwSplit:[["Set the split stance","One foot forward, one back, hip-width apart, back heel lifted."],["Stay tall","Ribs over the pelvis, weight mostly on the front foot."],["Lower straight down","Bend both knees until the back knee nearly touches the floor."],["Drive up","Push through the front heel to stand without shifting forward."],["Finish the side","Complete all reps, then switch legs."]],
  pushup:[["Set the plank","Hands under the shoulders, feet together, body straight from head to heels."],["Brace","Squeeze glutes and trunk so the hips don't sag."],["Lower","Bend the elbows about 45° from the body until the chest is just above the floor."],["Press","Push the floor away and return to a strong plank."],["Scale if needed","Hands on a bench or knees down to keep perfect form."]],
  pike:[["Make an inverted V","Hands shoulder-width, hips high, legs as straight as comfortable."],["Shift forward","Bring the shoulders over the hands."],["Lower the head","Bend the elbows and lower the top of the head toward the floor in front of the hands."],["Press back","Push away until the arms are straight, hips still high."],["Control","Keep the neck neutral and elbows pointing back."]],
  invRow:[["Set up under the edge","Lie under a sturdy table or low bar and grip just wider than the shoulders."],["Straight body","Heels on the floor, body straight from head to heels."],["Pull","Pull the chest to the edge by driving the elbows down and back."],["Squeeze","Pause and squeeze the shoulder blades together."],["Lower slowly","Straighten the arms under control and repeat."]],
  ytw:[["Lie face down","Forehead on a towel, arms overhead, thumbs up."],["Y raise","Lift the arms in a Y shape by squeezing the shoulder blades."],["T raise","Arms out to the sides; lift and squeeze."],["W raise","Elbows bent into a W; pull the shoulder blades down and together."],["Pause each rep","Hold 1–2 seconds at the top without lifting the chest."]],
  dips:[["Set the chair","Stable chair against a wall; hands on the edge, fingers forward."],["Lift off","Slide the hips forward off the seat, arms straight, shoulders down."],["Lower","Bend the elbows straight back until the upper arms are about parallel."],["Press up","Push through the palms to straighten the arms."],["Stay open","Keep the chest proud; don't let the shoulders roll forward."]],
  slBridge:[["Set up","Lie on your back, one heel close to the glutes, other leg lifted."],["Brace","Press the lower back gently down and pull the ribs down."],["Drive up","Push through the heel and lift the hips until shoulder, hip and knee line up."],["Squeeze","Pause and squeeze the glute without arching the back."],["Lower","Lower slowly, keep the hips level and repeat."]],
  plank:[["Forearms down","Elbows under the shoulders, forearms parallel."],["Straight line","Step the feet back so the body is straight from head to heels."],["Brace","Squeeze glutes, pull the ribs down and push the floor away."],["Breathe","Hold with calm, steady breaths."],["Finish","Drop to the knees when form fades."]],
  sidePlank:[["Set the elbow","Lie on your side with the elbow under the shoulder."],["Stack the legs","Feet stacked or staggered for balance."],["Lift","Raise the hips until the body is straight from head to feet."],["Hold","Hips high and slightly forward; breathe calmly."],["Switch","Lower with control and repeat on the other side."]],
  deadBug:[["Set up","Lie on your back, knees above hips, arms toward the ceiling."],["Flatten the back","Press the lower back gently into the floor."],["Extend","Slowly reach one arm back and the opposite leg long as you exhale."],["Return","Bring them back without the back arching."],["Alternate","Repeat on the other side, slow and controlled."]],
  burpee:[["Stand tall","Feet hip-width, arms relaxed."],["Hands down","Squat and place the hands on the floor."],["Jump or step back","Move into a plank with a straight body."],["Push-up (optional)","Lower the chest and press up, or skip it to scale."],["Stand and jump","Bring the feet in, stand and finish with a small jump."]],
  highKnee:[["Stand tall","Feet hip-width, arms bent at 90°."],["Drive the knees","Bring each knee up toward hip height."],["Quick feet","Land lightly on the balls of the feet."],["Pump the arms","Arms move in rhythm with the legs."],["Recover","March in place during the easy part and control your breathing."]],
  bwCircuit:[["Set your space","Clear a small area so you can move between stations safely."],["Start easy","Round one below maximum; find a pace you can repeat."],["Clean reps","Every squat, push-up and lunge with full form."],["Smooth transitions","Move straight to the next station without rushing setup."],["Repeat evenly","Aim for similar quality every round."]],
  walkJog:[["Warm up","Start with five minutes of easy walking."],["Find your pace","Build to a pace where you breathe harder but can still talk."],["Stay tall","Relaxed shoulders, arms swinging naturally."],["Hold it steady","Keep the same effort for the whole block."],["Cool down","Finish with a few minutes of easy walking."]]
});

const FEEL_EXTRA = {
  bwSquat:"Quads and glutes working while the heels stay down.", jumpSquat:"Quick, springy power through the legs and hips; soft landings.",
  slRdl:"Hamstring and glute on the standing leg, plus balance through the foot.", revLunge:"Front-leg glute and quads, with steady balance.",
  bwSplit:"Front-leg quads and glute; a stretch at the front of the back hip.", pushup:"Chest, shoulders and triceps, with the trunk holding a straight line.",
  pike:"Shoulders and triceps pressing overhead.", invRow:"Upper back and lats pulling while the body stays straight.",
  ytw:"Upper back and the muscles between the shoulder blades.", dips:"Triceps and chest, with shoulders staying open.",
  slBridge:"A strong glute squeeze on the working side, not the lower back.", plank:"Deep trunk tension from ribs to hips.",
  sidePlank:"The side of the trunk and hip holding you up.", deadBug:"Deep abs working to keep the lower back flat.",
  burpee:"Whole-body effort and breathing; repeatable, not all-out.", highKnee:"Heart rate up with light, quick feet.",
  bwCircuit:"Whole-body work that stays technically clean.", walkJog:"Comfortably hard breathing you could hold for the whole block."
};

/* ---------- German ---------- */
Object.assign(DE.names, {
  "Bodyweight Squat":"Kniebeuge ohne Gewicht", "Jump Squat":"Sprungkniebeuge", "Single-Leg Romanian Deadlift":"Einbeiniges Rumänisches Kreuzheben",
  "Reverse Lunge":"Ausfallschritt rückwärts", "Bodyweight Split Squat":"Split Squat ohne Gewicht", "Push-up":"Liegestütz", "Pike Push-up":"Pike-Liegestütz",
  "Inverted Row":"Umgekehrtes Rudern", "Prone Y-T-W Raise":"Y-T-W in Bauchlage", "Chair Dips":"Dips am Stuhl", "Single-Leg Glute Bridge":"Einbeinige Glute Bridge",
  "Plank":"Unterarmstütz", "Side Plank":"Seitstütz", "Dead Bug":"Dead Bug", "Burpee Intervals":"Burpee-Intervalle", "High-Knee Intervals":"Kniehebelauf-Intervalle",
  "Bodyweight Engine Circuit":"Körpergewichts-Zirkel", "Brisk Walk or Easy Jog":"Zügiges Gehen oder lockeres Joggen"
});
Object.assign(DE.ex, {
  "Bodyweight Squat":["Setz dich zwischen die Hüften, Brust aufrecht, und steh auf, indem du den Boden wegdrückst.",["Füße schulterbreit, Zehen leicht nach außen","Knie über den Zehen","Langsam in 3 Sekunden absenken"],["Fersen heben ab","Knie knicken nach innen"]],
  "Jump Squat":["Kurz eintauchen, explosiv springen, weich landen und vor dem nächsten Sprung neu ansetzen.",["Viertel-Kniebeuge als Ausholbewegung","Über den ganzen Fuß abdrücken","Leise mit weichen Knien landen"],["Mit gestreckten Beinen landen","Knie knicken bei der Landung ein"]],
  "Single-Leg Romanian Deadlift":["Auf einem Bein aus der Hüfte beugen, Rücken lang, Hüfte bleibt parallel zum Boden.",["Standknie leicht gebeugt","Hüfte wandert nach hinten","Hinteres Bein und Oberkörper bewegen sich zusammen"],["Rücken wird rund","Hüfte dreht zur Seite auf"]],
  "Reverse Lunge":["Schritt nach hinten, hinteres Knie kontrolliert absenken, über den vorderen Fuß hochdrücken.",["Langer Schritt nach hinten","Vorderer Fuß bleibt am Boden","Oberkörper aufrecht"],["Vorderes Knie knickt ein","Mit dem hinteren Fuß abstoßen"]],
  "Bodyweight Split Squat":["In der Schrittstellung bleiben und langsam gerade auf und ab bewegen.",["Versetzter, hüftbreiter Stand","Gerade nach unten absenken","Über die vordere Ferse drücken"],["Zu kurzer, schmaler Stand","Weit nach vorne lehnen"]],
  "Push-up":["Hände unter den Schultern, Körper eine gerade Linie, Brust bis knapp über den Boden.",["Gesäß und Rumpf anspannen","Ellbogen etwa 45° vom Körper","Voller Bewegungsumfang"],["Hüfte hängt durch","Nur halbe Wiederholungen"]],
  "Pike Push-up":["Hüfte hoch wie ein umgedrehtes V; den Kopf zwischen den Händen Richtung Boden senken.",["Hüfte hoch gestapelt","Kopf wandert vor die Hände","Zurück ins V drücken"],["Ellbogen weit abgespreizt","Hüfte sinkt in die Plank"]],
  "Inverted Row":["Unter einem stabilen Tisch oder einer tiefen Stange die Brust mit geradem Körper hochziehen.",["Griff etwas breiter als schulterbreit","Körper gerade von Fersen bis Kopf","Brust zur Kante ziehen"],["Hüfte hängt durch","Schultern hochziehen"]],
  "Prone Y-T-W Raise":["In Bauchlage die Arme in Y-, T- und W-Form heben, indem du die Schulterblätter zusammenziehst.",["Daumen nach oben, Nacken lang","Schulterblätter zusammenziehen","Oben 1–2 Sekunden halten"],["Ins Hohlkreuz gehen","Kopf anheben"]],
  "Chair Dips":["Hände hinter dir auf einem stabilen Stuhl; absenken, bis die Oberarme etwa waagerecht sind.",["Stuhl an die Wand stellen","Schultern unten, Brust offen","Ellbogen zeigen gerade nach hinten"],["Zu tief absenken","Schultern rollen nach vorne"]],
  "Single-Leg Glute Bridge":["Über eine Ferse drücken und die Hüfte heben, bis Schulter, Hüfte und Knie eine Linie bilden.",["Ferse nah am Gesäß","Rippen unten","Oben anspannen und halten"],["Ins Hohlkreuz gehen","Hüfte kippt zur Seite"]],
  "Plank":["Unterarme unter den Schultern, eine gerade Linie von Kopf bis Fersen, ruhig atmen.",["Gesäß anspannen","Rippen nach unten ziehen","Den Boden wegdrücken"],["Hüfte hängt durch","Luft anhalten"]],
  "Side Plank":["Ellbogen unter der Schulter, Hüfte hoch, Körper gerade von Kopf bis Füßen.",["Füße übereinander oder versetzt","Hüfte hoch und leicht nach vorne","Oberer Arm lang oder an der Hüfte"],["Hüfte sinkt ab","Nach hinten wegkippen"]],
  "Dead Bug":["Unterer Rücken am Boden; langsam den gegenüberliegenden Arm und das Bein strecken, ohne die Position zu verlieren.",["Knie über der Hüfte, Arme zur Decke","Beim Strecken ausatmen","Langsam, Rücken bleibt flach"],["Unterer Rücken hebt ab","Zu schnell werden"]],
  "Burpee Intervals":["Gleichmäßige, wiederholbare Burpees; bei Bedarf nach hinten steigen statt springen.",["Hände runter, zurückspringen oder -steigen","Brust runter, hochdrücken","Aufstehen und kleiner Sprung"],["Die ersten Runden zu schnell","Hüfte hängt in der Plank durch"]],
  "High-Knee Intervals":["Knie bis auf Hüfthöhe, schnelle, leichte Füße; in der Pause auf der Stelle gehen.",["Aufrecht bleiben","Auf den Fußballen landen","Arme im Rhythmus mitnehmen"],["Nach hinten lehnen","Schwere, laute Landungen"]],
  "Bodyweight Engine Circuit":["Gleichmäßiges Tempo; jede Wiederholung so sauber wie in der ersten Runde.",["Erste Runde bewusst ruhig","Sauber zwischen den Stationen wechseln","Tief durchatmen"],["Erste Runde zu schnell","Schlampige Wiederholungen bei Müdigkeit"]],
  "Brisk Walk or Easy Jog":["Gesprächstempo: Du atmest schneller, kannst aber noch in ganzen Sätzen sprechen.",["Aufrechte Haltung","Schultern locker","Gleichmäßiger Rhythmus"],["Zu schnell starten","Mit krummem Rücken schlurfen"]]
});
Object.assign(DE.steps, {
  bwSquat:[["Position einnehmen","Steh schulterbreit, Zehen leicht nach außen, Arme zur Balance nach vorne."],["Anspannen","Atme ein und spann den Rumpf an, bevor du dich bewegst."],["Langsam absenken","Setz dich in etwa drei Sekunden zwischen die Hüften, Knie über den Zehen, Fersen unten."],["Tiefe erreichen","Geh so tief, wie es mit aufrechter Brust und flachen Füßen geht."],["Aufstehen","Drück den Boden weg und komm mit angespanntem Gesäß ganz nach oben."]],
  jumpSquat:[["Position einnehmen","Füße schulterbreit, Arme bereit zum Schwingen."],["Kurz eintauchen","Geh in eine Viertel-Kniebeuge, Brust bleibt oben."],["Explodieren","Drück über den ganzen Fuß ab und schwing die Arme beim Sprung nach oben."],["Weich landen","Lande leise über die Fußballen in gebeugte Knie."],["Neu ansetzen","Steh aufrecht, finde dein Gleichgewicht und spring erneut."]],
  slRdl:[["Auf einem Bein stehen","Standknie leicht gebeugt, Hände an der Hüfte oder nach vorne."],["Nach hinten beugen","Schieb die Hüfte nach hinten, das freie Bein streckt sich nach hinten."],["Gerade bleiben","Oberkörper und hinteres Bein bilden eine Linie; die Hüfte zeigt zum Boden."],["Beinbeuger spüren","Stopp, wenn der Beinbeuger des Standbeins begrenzt."],["Zurück","Schieb die Hüfte nach vorne, steh aufrecht und wiederhole."]],
  revLunge:[["Aufrecht stehen","Füße hüftbreit, Hände an der Hüfte oder vor dem Körper."],["Schritt zurück","Mach einen langen Schritt nach hinten und setz auf dem Fußballen auf."],["Absenken","Senk das hintere Knie Richtung Boden, das vordere Knie bleibt über dem Fuß."],["Hochdrücken","Drück dich über den ganzen vorderen Fuß zurück in den Stand."],["Wechseln","Wiederhole mit dem anderen Bein, genauso kontrolliert."]],
  bwSplit:[["Schrittstellung","Ein Fuß vorne, einer hinten, hüftbreit, hintere Ferse angehoben."],["Aufrecht bleiben","Rippen über dem Becken, Gewicht vor allem auf dem vorderen Fuß."],["Gerade absenken","Beug beide Knie, bis das hintere Knie fast den Boden berührt."],["Hochdrücken","Drück über die vordere Ferse nach oben, ohne nach vorne zu wandern."],["Seite beenden","Mach alle Wiederholungen und wechsle dann das Bein."]],
  pushup:[["Plank aufbauen","Hände unter den Schultern, Füße zusammen, Körper gerade von Kopf bis Fersen."],["Anspannen","Spann Gesäß und Rumpf an, damit die Hüfte nicht durchhängt."],["Absenken","Beug die Ellbogen etwa 45° vom Körper, bis die Brust knapp über dem Boden ist."],["Drücken","Drück den Boden weg zurück in eine feste Plank."],["Bei Bedarf erleichtern","Hände auf eine Bank oder Knie am Boden, um die Technik sauber zu halten."]],
  pike:[["Umgedrehtes V","Hände schulterbreit, Hüfte hoch, Beine so gestreckt wie angenehm."],["Nach vorne verlagern","Bring die Schultern über die Hände."],["Kopf absenken","Beug die Ellbogen und senk den Scheitel vor den Händen Richtung Boden."],["Zurückdrücken","Drück dich weg, bis die Arme gestreckt sind; die Hüfte bleibt oben."],["Kontrolle","Nacken neutral, Ellbogen zeigen nach hinten."]],
  invRow:[["Unter die Kante","Leg dich unter einen stabilen Tisch oder eine tiefe Stange und greif etwas breiter als schulterbreit."],["Gerader Körper","Fersen am Boden, Körper gerade von Kopf bis Fersen."],["Ziehen","Zieh die Brust zur Kante, indem du die Ellbogen nach unten und hinten führst."],["Anspannen","Halte kurz und zieh die Schulterblätter zusammen."],["Langsam ablassen","Streck die Arme kontrolliert und wiederhole."]],
  ytw:[["Bauchlage","Stirn auf einem Handtuch, Arme über dem Kopf, Daumen nach oben."],["Y heben","Heb die Arme in Y-Form, indem du die Schulterblätter zusammenziehst."],["T heben","Arme seitlich ausstrecken, anheben und anspannen."],["W heben","Ellbogen zum W beugen; Schulterblätter nach unten und zusammen ziehen."],["Jede Wiederholung halten","Oben 1–2 Sekunden halten, ohne die Brust anzuheben."]],
  dips:[["Stuhl vorbereiten","Stabilen Stuhl an die Wand stellen, Hände an die Kante, Finger nach vorne."],["Abheben","Schieb die Hüfte vom Sitz, Arme gestreckt, Schultern unten."],["Absenken","Beug die Ellbogen gerade nach hinten, bis die Oberarme etwa waagerecht sind."],["Hochdrücken","Drück dich über die Handflächen hoch, bis die Arme gestreckt sind."],["Offen bleiben","Brust stolz, die Schultern rollen nicht nach vorne."]],
  slBridge:[["Position","Leg dich auf den Rücken, eine Ferse nah am Gesäß, das andere Bein angehoben."],["Anspannen","Drück den unteren Rücken sanft nach unten und zieh die Rippen nach unten."],["Hochdrücken","Drück über die Ferse und heb die Hüfte, bis Schulter, Hüfte und Knie eine Linie bilden."],["Anspannen","Halte kurz und spann das Gesäß an, ohne ins Hohlkreuz zu gehen."],["Absenken","Senk langsam ab, Hüfte bleibt waagerecht, und wiederhole."]],
  plank:[["Unterarme auf","Ellbogen unter den Schultern, Unterarme parallel."],["Gerade Linie","Stell die Füße nach hinten, der Körper ist gerade von Kopf bis Fersen."],["Anspannen","Gesäß anspannen, Rippen nach unten, Boden wegdrücken."],["Atmen","Halte mit ruhigen, gleichmäßigen Atemzügen."],["Beenden","Geh auf die Knie, wenn die Technik nachlässt."]],
  sidePlank:[["Ellbogen setzen","Leg dich auf die Seite, Ellbogen unter der Schulter."],["Beine stapeln","Füße übereinander oder für die Balance versetzt."],["Anheben","Heb die Hüfte, bis der Körper gerade von Kopf bis Füßen ist."],["Halten","Hüfte hoch und leicht nach vorne, ruhig atmen."],["Wechseln","Kontrolliert absenken und die andere Seite machen."]],
  deadBug:[["Position","Rückenlage, Knie über der Hüfte, Arme zur Decke."],["Rücken flach","Drück den unteren Rücken sanft in den Boden."],["Strecken","Streck beim Ausatmen langsam einen Arm nach hinten und das gegenüberliegende Bein lang."],["Zurück","Bring beides zurück, ohne dass der Rücken abhebt."],["Wechseln","Wiederhole auf der anderen Seite, langsam und kontrolliert."]],
  burpee:[["Aufrecht stehen","Füße hüftbreit, Arme locker."],["Hände runter","Geh in die Hocke und setz die Hände auf den Boden."],["Zurückspringen oder -steigen","Komm in eine Plank mit geradem Körper."],["Liegestütz (optional)","Brust absenken und hochdrücken, oder zum Erleichtern weglassen."],["Aufstehen und springen","Füße heranziehen, aufstehen und mit einem kleinen Sprung beenden."]],
  highKnee:[["Aufrecht stehen","Füße hüftbreit, Arme im 90-Grad-Winkel."],["Knie hoch","Zieh jedes Knie Richtung Hüfthöhe."],["Schnelle Füße","Lande leicht auf den Fußballen."],["Arme mitnehmen","Die Arme bewegen sich im Rhythmus der Beine."],["Erholen","Geh in der lockeren Phase auf der Stelle und beruhige deine Atmung."]],
  bwCircuit:[["Platz schaffen","Räum einen kleinen Bereich frei, damit du sicher zwischen den Stationen wechseln kannst."],["Locker starten","Erste Runde unter dem Maximum; finde ein Tempo, das du halten kannst."],["Saubere Wiederholungen","Jede Kniebeuge, jeder Liegestütz und Ausfallschritt mit voller Technik."],["Fließende Wechsel","Geh direkt zur nächsten Station, ohne zu hetzen."],["Gleichmäßig wiederholen","Ziel ist dieselbe Qualität in jeder Runde."]],
  walkJog:[["Aufwärmen","Beginn mit fünf Minuten lockerem Gehen."],["Tempo finden","Steigere auf ein Tempo, bei dem du schneller atmest, aber noch sprechen kannst."],["Aufrecht bleiben","Schultern locker, Arme schwingen natürlich mit."],["Gleichmäßig halten","Halte die gleiche Anstrengung für den ganzen Block."],["Auslaufen","Beende mit ein paar Minuten lockerem Gehen."]]
});
Object.assign(DE.feel, {
  bwSquat:"Oberschenkel und Gesäß arbeiten, die Fersen bleiben unten.", jumpSquat:"Schnelle, federnde Kraft aus Beinen und Hüfte; weiche Landungen.",
  slRdl:"Beinbeuger und Gesäß des Standbeins, dazu Balance über den Fuß.", revLunge:"Gesäß und Oberschenkel des vorderen Beins, bei stabiler Balance.",
  bwSplit:"Oberschenkel und Gesäß vorne; eine Dehnung vorne an der hinteren Hüfte.", pushup:"Brust, Schultern und Trizeps, der Rumpf hält eine gerade Linie.",
  pike:"Schultern und Trizeps drücken über Kopf.", invRow:"Oberer Rücken und Latissimus ziehen, der Körper bleibt gerade.",
  ytw:"Oberer Rücken und die Muskeln zwischen den Schulterblättern.", dips:"Trizeps und Brust, die Schultern bleiben offen.",
  slBridge:"Kräftige Gesäßanspannung auf der Arbeitsseite, nicht im unteren Rücken.", plank:"Tiefe Rumpfspannung von den Rippen bis zur Hüfte.",
  sidePlank:"Die Rumpf- und Hüftseite, die dich trägt.", deadBug:"Die tiefen Bauchmuskeln halten den unteren Rücken flach.",
  burpee:"Ganzkörperbelastung und Atmung; wiederholbar, nicht maximal.", highKnee:"Puls hoch mit leichten, schnellen Füßen.",
  bwCircuit:"Ganzkörperarbeit, die technisch sauber bleibt.", walkJog:"Angenehm fordernde Atmung, die du den ganzen Block halten kannst."
});

/* ---------- exercise pools for the programme builder ---------- */
const MOB_LOWER = ["Hip 90/90 Flow","World's Greatest Stretch","Deep Squat Pry","Ankle Dorsiflexion Rock","Cossack Squat"];
const FLEX_LOWER = ["Couch Stretch","Supine Hamstring Stretch","Hip Flexor + Rotation Stretch","Figure-4 Glute Stretch","Adductor Rockback Stretch","Calf Wall Stretch"];
const FLEX_UPPER = ["Doorway Pec Stretch","Child's Pose Lat Stretch"];
const POOLS = {
  gym:{
    squat:["Front Squat","Leg Press"], hinge:["Deadlift","Dumbbell Romanian Deadlift","Kettlebell Deadlift"],
    lunge:["Bulgarian Split Squat","Walking Dumbbell Lunge"], glute:["Hip Thrust"], ham:["Hamstring Curl","Dumbbell Romanian Deadlift"],
    pushH:["Bench Press","Incline Dumbbell Press"], pushV:["Dumbbell Shoulder Press"], pullH:["Chest-Supported Row","Single-Arm Cable Row"], pullV:["Lat Pulldown"],
    core:["Pallof Press","Push-up + Renegade Row"], durability:["Farmer Carry","Step-Down Control","Pallof Press"],
    power:["Kettlebell Swing"], interval:["StairMaster Intervals","Bike Intervals"], steady:["StairMaster Steady State"], circuit:["CrossFit Engine Circuit"],
    mobLower:MOB_LOWER, mobUpper:["Band Shoulder Dislocates","Thoracic Rotation","Inchworm to Down Dog"], flexLower:FLEX_LOWER, flexUpper:FLEX_UPPER
  },
  bodyweight:{
    squat:["Bodyweight Squat","Reverse Lunge"], hinge:["Single-Leg Romanian Deadlift","Single-Leg Glute Bridge"],
    lunge:["Reverse Lunge","Bodyweight Split Squat","Step-Down Control"], glute:["Single-Leg Glute Bridge"], ham:["Single-Leg Romanian Deadlift"],
    pushH:["Push-up","Chair Dips"], pushV:["Pike Push-up"], pullH:["Inverted Row"], pullV:["Prone Y-T-W Raise"],
    core:["Plank","Dead Bug","Side Plank"], durability:["Side Plank","Dead Bug","Step-Down Control"],
    power:["Jump Squat"], interval:["Burpee Intervals","High-Knee Intervals"], steady:["Brisk Walk or Easy Jog"], circuit:["Bodyweight Engine Circuit"],
    mobLower:MOB_LOWER, mobUpper:["Thoracic Rotation","Inchworm to Down Dog"], flexLower:FLEX_LOWER, flexUpper:FLEX_UPPER
  }
};
