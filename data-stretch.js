"use strict";
/* Zahi Fit v5.2 — warm-up drills + cool-down stretches (incl. the hip & knee stretching handout).
   Every session: easy cardio + drills first, 2–4 stretches for the muscles trained last. */

/* E(name, block, sets, reps, rest, cue, video, how, mistakes, subs) */
const STRETCH_LIB = [
// warm-up
E("Easy Cardio Warm-up","Mobility",1,"5 min easy",0,"Bike, rower, treadmill or brisk walk — easy pace, just getting warm.","",["Easy effort, you can chat","Gradually lift the pace in the last minute","Stay relaxed"],["Going hard in the warm-up","Skipping it when short on time"],["Leg Swings","Arm Circles"]),
E("Leg Swings","Mobility",1,"10 each way/leg",0,"Hold a wall and swing one leg front-to-back, then side-to-side, in a smooth arc.","",["Stand tall, one hand on a wall","Swing front-to-back, gradually bigger","Then swing side-to-side across the body"],["Leaning or twisting the torso","Kicking hard to the end of range"],["Hip 90/90 Flow","World's Greatest Stretch"]),
E("Arm Circles","Mobility",1,"10 each way",0,"Small circles growing into big ones, forwards then backwards.","",["Arms out to the sides","Start small and grow the circles","Reverse direction"],["Shrugging the shoulders","Rushing"],["Thoracic Rotation","Cat-Cow"]),
E("Cat-Cow","Mobility",1,"8 slow reps",0,"On hands and knees, round the whole spine up, then let it sink and lift the chest.","",["Hands under shoulders, knees under hips","Exhale and round up (cat)","Inhale, chest forward, hips up (cow)"],["Moving only the lower back","Holding your breath"],["Thoracic Rotation","Child's Pose Lat Stretch"]),
// from the hip & knee stretching handout
E("Butterfly Stretch","Flexibility",1,"30 sec",0,"Seated, soles together, back tall; gently draw the feet in until the inner thighs stretch.","",["Sit tall, soles of the feet together","Hold the feet or ankles","Let the knees relax toward the floor"],["Rounding the back","Pushing the knees down forcefully"],["Adductor Rockback Stretch","Figure-4 Glute Stretch"]),
E("Seated Twist Glute Stretch","Flexibility",1,"30 sec/side",0,"Legs long, cross one foot over near the knee and use the opposite arm to ease the bent knee across.","",["One leg straight, cross the other foot next to the knee","Back hand on the floor for support","Opposite arm presses the bent knee across"],["Slumping backwards","Twisting hard into pain"],["Figure-4 Glute Stretch","Knee-to-Chest Stretch"]),
E("Seated Hamstring Reach","Flexibility",1,"30 sec/side",0,"One leg long, the other foot to the inner thigh; reach along the straight leg with a long back.","",["One leg straight, other foot against the inner thigh","Hinge forward from the hips","Reach toward the ankle, back long"],["Rounding to reach further","Bouncing"],["Supine Hamstring Stretch","Wall Hamstring Stretch"]),
E("Knee-to-Chest Stretch","Flexibility",1,"30 sec/side",0,"Lying on your back, hug one knee toward your chest; the other leg can be straight or bent.","",["Lie on your back","Hands around the shin or behind the thigh","Draw the knee in until the hip and glute stretch"],["Lifting the head and neck","Pulling so hard the lower back lifts"],["Figure-4 Glute Stretch","Seated Twist Glute Stretch"]),
E("Wall Hamstring Stretch","Flexibility",1,"45 sec/side",0,"Lying in a doorway, one leg up the wall, the other flat on the floor; move closer as it relaxes.","",["Lie by a doorway or wall corner","One leg up the wall, other leg long on the floor","Shuffle closer as the hamstring relaxes"],["Bending the lifted knee a lot","Lifting the hips off the floor"],["Supine Hamstring Stretch","Seated Hamstring Reach"]),
E("Low Lunge Hip Flexor Stretch","Flexibility",1,"30 sec/side",0,"Deep lunge, back leg long behind you, fingertips down, sink the hips toward the floor.","",["Step one foot forward into a deep lunge","Back leg long, fingertips on the floor","Chest up, sink the hips down and forward"],["Front knee collapsing inward","Arching the lower back hard"],["Hip Flexor + Rotation Stretch","Couch Stretch"]),
E("Standing Hamstring Stretch","Flexibility",1,"30 sec/side",0,"Heel on a low step or stool, leg straight; hinge forward from the hips.","",["Heel on a low, stable step","Standing leg soft, hips square","Hinge forward with a long back"],["Rounding the back","Using a step that's too high"],["Seated Hamstring Reach","Supine Hamstring Stretch"]),
E("Standing Outer Hip Stretch","Flexibility",1,"30 sec/side",0,"Cross one leg in front of the other and lean toward the front-leg side to stretch the outer hip.","",["Stand tall, hands on hips","Cross one leg in front of the other","Lean the hips out and the body sideways"],["Leaning forward instead of sideways","Losing balance — use a wall"],["Figure-4 Glute Stretch","Seated Twist Glute Stretch"]),
E("Bent-Knee Calf Stretch","Flexibility",1,"30 sec/side",0,"Hands on the wall, back heel down with the knee bent, lean in to stretch the lower calf.","",["Hands on the wall at shoulder height","Step one foot back, heel down","Bend both knees and lean in"],["Heel lifting","Turning the back foot out"],["Calf Wall Stretch","Ankle Dorsiflexion Rock"]),
// extra stretches
E("Standing Quad Stretch","Flexibility",1,"30 sec/side",0,"Standing tall, hold one ankle behind you with knees together and hips pushed slightly forward.","",["Hold a wall for balance","Knees together, heel toward the glute","Tuck the pelvis slightly"],["Arching the lower back","Knee drifting out to the side"],["Couch Stretch","Low Lunge Hip Flexor Stretch"]),
E("Pigeon Stretch","Flexibility",1,"45 sec/side",0,"Front shin across the body, back leg long; lower the hips and chest over the front leg.","",["Front shin angled across, back leg long","Hips square to the floor","Walk the hands forward and relax"],["Hips rolling to one side","Forcing the front knee"],["Figure-4 Glute Stretch","Hip 90/90 Flow"]),
E("Cross-Body Shoulder Stretch","Flexibility",1,"30 sec/side",0,"Bring one straight arm across your chest and hold it just above the elbow.","",["Arm across at chest height","Other hand above the elbow","Keep the shoulder down"],["Shrugging","Twisting the body"],["Doorway Pec Stretch","Child's Pose Lat Stretch"]),
E("Overhead Triceps Stretch","Flexibility",1,"30 sec/side",0,"Reach one hand down your upper back and gently guide the elbow with the other hand.","",["Elbow up, hand down the upper back","Other hand on the elbow","Ribs down, head tall"],["Arching the back","Pushing the neck forward"],["Cross-Body Shoulder Stretch","Child's Pose Lat Stretch"]),
E("Cobra Stretch","Flexibility",1,"30 sec",0,"Lying face down, press up gently through the hands with the hips on the floor.","",["Hands under shoulders","Press up slowly, hips stay down","Shoulders down, neck long"],["Pushing into lower-back pain","Shrugging"],["Child's Pose Lat Stretch","Cat-Cow"])
];
STRETCH_LIB.forEach(x => { x.bw = false; });
EXTRA.push(...STRETCH_LIB);

Object.assign(FAMILY, {"Easy Cardio Warm-up":"warmCardio", "Leg Swings":"legSwing", "Arm Circles":"armCircle", "Cat-Cow":"catCow",
  "Butterfly Stretch":"butterfly", "Seated Twist Glute Stretch":"seatTwist", "Seated Hamstring Reach":"seatHam", "Knee-to-Chest Stretch":"kneeChest",
  "Wall Hamstring Stretch":"wallHam", "Low Lunge Hip Flexor Stretch":"lowLunge", "Standing Hamstring Stretch":"standHam", "Standing Outer Hip Stretch":"outerHip",
  "Bent-Knee Calf Stretch":"soleus", "Standing Quad Stretch":"quad", "Pigeon Stretch":"pigeon", "Cross-Body Shoulder Stretch":"crossArm",
  "Overhead Triceps Stretch":"triceps", "Cobra Stretch":"cobra"});
Object.assign(STEPS, {
  warmCardio:[["Pick a machine","Bike, rower, treadmill, StairMaster — or a brisk walk."],["Start easy","An effort where you could hold a conversation."],["Stay relaxed","Loose shoulders, steady breathing."],["Build slightly","Lift the pace a little in the last minute."],["Ready","You should feel warm, not tired."]],
  legSwing:[["Hold on","Stand tall beside a wall with one hand on it."],["Front to back","Swing the outside leg forward and back."],["Grow the range","Let each swing get a little bigger."],["Side to side","Face the wall and swing the leg across and out."],["Switch","Repeat on the other leg."]],
  armCircle:[["Arms out","Stand tall with arms out to the sides."],["Small circles","Start with small forward circles."],["Grow","Let the circles get bigger."],["Reverse","Circle backwards the same way."],["Relax","Shake the arms out."]],
  catCow:[["All fours","Hands under the shoulders, knees under the hips."],["Cat","Breathe out and round your whole back up."],["Cow","Breathe in, let the belly sink and lift the chest."],["Flow","Move slowly between the two."],["Full spine","Feel the movement from neck to tailbone."]],
  butterfly:[["Sit tall","Sit on the floor with a straight back."],["Soles together","Bend the knees and bring the soles of the feet together."],["Hold the feet","Hands around the feet or ankles."],["Draw in","Gently bring the feet toward you until the inner thighs stretch."],["Breathe","Hold and let the knees relax lower."]],
  seatTwist:[["Legs long","Sit with both legs straight."],["Cross over","Bend one leg and place that foot on the other side of the straight knee."],["Support","Back hand on the floor behind you."],["Ease across","Opposite arm presses the bent knee across until the glute stretches."],["Switch","Relax, then change sides."]],
  seatHam:[["Set up","One leg straight, the other foot against the inner thigh."],["Sit tall","Lengthen the spine."],["Hinge","Fold forward from the hips."],["Reach","Hands slide along the straight leg until the back of the thigh stretches."],["Switch","Relax and change sides."]],
  kneeChest:[["Lie down","Lie on your back."],["Lift a knee","Bend one knee toward you."],["Hug it","Hands around the shin or behind the thigh."],["Draw in","Pull gently until the hip and glute stretch."],["Option","Keep the other leg straight or bent — then switch."]],
  wallHam:[["Find a doorway","Lie on your back beside a doorframe or wall corner."],["Leg up","Rest one leg up the wall, the other long on the floor."],["Feel it","Move your hips closer until the back of the thigh stretches."],["Creep closer","As it relaxes, shuffle a little closer."],["Come out","Slide back, lower the leg and switch."]],
  lowLunge:[["Deep lunge","Step one foot forward, fingertips on the floor."],["Back leg long","Straighten the back leg behind you."],["Chest up","Lift the chest, back slightly arched."],["Sink","Let the hips move down and forward."],["Switch","Relax and change sides."]],
  standHam:[["Step up","Rest one heel on a low, stable step or stool."],["Square hips","Standing knee soft, hips facing forward."],["Hinge","Lean forward from the hips with a long back."],["Slide the hands","Let the hands slide down the leg until it stretches."],["Switch","Relax and change sides."]],
  outerHip:[["Stand tall","Hands on your hips; use a wall if needed."],["Cross","Cross one leg in front of the other."],["Lean","Push the hips out and lean the body sideways."],["Feel it","The stretch is on the outside of the hip."],["Switch","Relax and change sides."]],
  soleus:[["At the wall","Face the wall, hands at shoulder height."],["Step back","One foot back, heel down."],["Bend","Bend both knees."],["Lean","Lean in until the lower calf stretches."],["Switch","Relax and change sides."]],
  quad:[["Balance","Stand tall with a hand on a wall."],["Grab the ankle","Bend one knee and hold the ankle behind you."],["Knees together","Keep the knees side by side."],["Tuck","Tilt the pelvis under slightly for a deeper stretch."],["Switch","Release and change sides."]],
  pigeon:[["Front shin","Bring one shin across in front of you."],["Back leg long","Slide the other leg straight back."],["Square up","Keep the hips level."],["Fold","Walk the hands forward and relax the chest down."],["Switch","Come out slowly and change sides."]],
  crossArm:[["Arm across","Bring one straight arm across your chest."],["Hold","Other hand just above the elbow."],["Shoulder down","Keep the shoulder away from the ear."],["Draw in","Gently pull until the back of the shoulder stretches."],["Switch","Release and change sides."]],
  triceps:[["Elbow up","Raise one arm and bend the elbow."],["Hand down","Let the hand drop down the upper back."],["Guide","Other hand gently pushes the elbow back."],["Stay tall","Ribs down, neck relaxed."],["Switch","Release and change sides."]],
  cobra:[["Lie face down","Hands under the shoulders, legs long."],["Press up","Slowly straighten the arms partway."],["Hips down","Keep the hips on the floor."],["Shoulders down","Neck long, shoulders away from the ears."],["Lower","Come down slowly."]]
});
Object.assign(FEEL_EXTRA, {warmCardio:"Warm, breathing a little faster, loose.", legSwing:"Hips loosening with each swing.", armCircle:"Shoulders warming up.",
  catCow:"The whole spine moving gently.", butterfly:"Inner thighs.", seatTwist:"The glute and outer hip.", seatHam:"The back of the thigh.",
  kneeChest:"The hip and glute.", wallHam:"The back of the thigh, relaxing over time.", lowLunge:"The front of the back-leg hip.",
  standHam:"The back of the thigh.", outerHip:"The outside of the hip.", soleus:"The lower calf, near the Achilles.", quad:"The front of the thigh.",
  pigeon:"The glute and outer hip of the front leg.", crossArm:"The back of the shoulder.", triceps:"The back of the upper arm.", cobra:"The front of the torso; a gentle bend in the back."});
Object.assign(DE.names, {"Easy Cardio Warm-up":"Lockeres Cardio-Aufwärmen", "Leg Swings":"Beinschwingen", "Arm Circles":"Armkreisen", "Cat-Cow":"Katze-Kuh",
  "Butterfly Stretch":"Schmetterlings-Dehnung", "Seated Twist Glute Stretch":"Sitzende Drehdehnung (Gesäß)", "Seated Hamstring Reach":"Sitzende Beinbeuger-Dehnung",
  "Knee-to-Chest Stretch":"Knie-zur-Brust-Dehnung", "Wall Hamstring Stretch":"Beinbeuger-Dehnung an der Wand", "Low Lunge Hip Flexor Stretch":"Hüftbeuger-Dehnung im tiefen Ausfallschritt",
  "Standing Hamstring Stretch":"Stehende Beinbeuger-Dehnung", "Standing Outer Hip Stretch":"Stehende äußere Hüftdehnung", "Bent-Knee Calf Stretch":"Wadendehnung mit gebeugtem Knie",
  "Standing Quad Stretch":"Stehende Oberschenkeldehnung", "Pigeon Stretch":"Tauben-Dehnung", "Cross-Body Shoulder Stretch":"Schulterdehnung vor dem Körper",
  "Overhead Triceps Stretch":"Trizeps-Dehnung über Kopf", "Cobra Stretch":"Kobra-Dehnung"});
Object.assign(DE.ex, {
  "Easy Cardio Warm-up":["Rad, Rudergerät, Laufband oder zügiges Gehen – locker, nur zum Aufwärmen.",["Lockere Anstrengung, du kannst sprechen","In der letzten Minute leicht steigern","Locker bleiben"],["Im Aufwärmen zu hart","Bei Zeitmangel weglassen"]],
  "Leg Swings":["An der Wand festhalten und ein Bein locker vor und zurück, dann seitlich schwingen.",["Aufrecht, eine Hand an der Wand","Vor und zurück, allmählich größer","Dann seitlich vor dem Körper schwingen"],["Oberkörper lehnt oder dreht mit","Ruckartig bis zum Ende treten"]],
  "Arm Circles":["Kleine Kreise, die größer werden – vorwärts, dann rückwärts.",["Arme seitlich ausstrecken","Klein anfangen, größer werden","Richtung wechseln"],["Schultern hochziehen","Zu schnell"]],
  "Cat-Cow":["Im Vierfüßlerstand den Rücken rund machen, dann durchhängen lassen und die Brust heben.",["Hände unter Schultern, Knie unter Hüfte","Ausatmen und rund machen (Katze)","Einatmen, Brust vor, Becken hoch (Kuh)"],["Nur den unteren Rücken bewegen","Luft anhalten"]],
  "Butterfly Stretch":["Sitzend, Fußsohlen zusammen, Rücken aufrecht; Füße sanft heranziehen, bis die Innenschenkel dehnen.",["Aufrecht sitzen, Fußsohlen zusammen","Füße oder Knöchel halten","Knie Richtung Boden entspannen"],["Rücken rund","Knie mit Kraft nach unten drücken"]],
  "Seated Twist Glute Stretch":["Beine lang, einen Fuß neben das Knie stellen und mit dem Gegenarm das Knie sanft hinüberdrücken.",["Ein Bein gestreckt, anderen Fuß neben das Knie","Hintere Hand stützt am Boden","Gegenarm drückt das gebeugte Knie hinüber"],["Nach hinten zusammensacken","Mit Schmerz stark drehen"]],
  "Seated Hamstring Reach":["Ein Bein lang, der andere Fuß am Innenschenkel; mit langem Rücken am gestreckten Bein entlang greifen.",["Ein Bein gestreckt, anderer Fuß am Innenschenkel","Aus der Hüfte nach vorne beugen","Richtung Knöchel greifen, Rücken lang"],["Rund machen, um weiter zu kommen","Wippen"]],
  "Knee-to-Chest Stretch":["In Rückenlage ein Knie zur Brust ziehen; das andere Bein gestreckt oder gebeugt.",["Auf den Rücken legen","Hände um das Schienbein oder hinter den Oberschenkel","Knie heranziehen, bis Hüfte und Gesäß dehnen"],["Kopf und Nacken anheben","So stark ziehen, dass der untere Rücken abhebt"]],
  "Wall Hamstring Stretch":["In einer Türöffnung liegend ein Bein an die Wand, das andere am Boden; näher rücken, wenn es nachlässt.",["Neben eine Türöffnung oder Wandecke legen","Ein Bein an die Wand, das andere lang am Boden","Näher rücken, wenn der Beinbeuger nachgibt"],["Angehobenes Knie stark beugen","Hüfte vom Boden heben"]],
  "Low Lunge Hip Flexor Stretch":["Tiefer Ausfallschritt, hinteres Bein lang, Fingerspitzen am Boden, Hüfte Richtung Boden sinken lassen.",["Einen Fuß weit nach vorne setzen","Hinteres Bein lang, Fingerspitzen am Boden","Brust oben, Hüfte nach unten und vorne"],["Vorderes Knie knickt nach innen","Starkes Hohlkreuz"]],
  "Standing Hamstring Stretch":["Ferse auf einer niedrigen Stufe, Bein gestreckt; aus der Hüfte nach vorne beugen.",["Ferse auf eine niedrige, stabile Stufe","Standbein locker, Hüfte gerade","Mit langem Rücken nach vorne beugen"],["Rücken rund","Zu hohe Stufe"]],
  "Standing Outer Hip Stretch":["Ein Bein vor dem anderen kreuzen und zur Seite des vorderen Beins lehnen.",["Aufrecht, Hände an der Hüfte","Ein Bein vor dem anderen kreuzen","Hüfte hinaus, Oberkörper zur Seite"],["Nach vorne statt seitlich lehnen","Gleichgewicht verlieren – Wand nutzen"]],
  "Bent-Knee Calf Stretch":["Hände an der Wand, hintere Ferse unten, Knie gebeugt; hineinlehnen, bis die untere Wade dehnt.",["Hände auf Schulterhöhe an die Wand","Einen Fuß zurück, Ferse unten","Beide Knie beugen und hineinlehnen"],["Ferse hebt ab","Hinteren Fuß nach außen drehen"]],
  "Standing Quad Stretch":["Aufrecht einen Knöchel hinten halten, Knie zusammen, Hüfte leicht nach vorne.",["An der Wand festhalten","Knie zusammen, Ferse zum Gesäß","Becken leicht einrollen"],["Hohlkreuz","Knie wandert zur Seite"]],
  "Pigeon Stretch":["Vorderes Schienbein quer, hinteres Bein lang; Hüfte und Brust über das vordere Bein senken.",["Vorderes Schienbein schräg, hinteres Bein lang","Hüfte gerade zum Boden","Hände nach vorne wandern und entspannen"],["Hüfte kippt zur Seite","Vorderes Knie forcieren"]],
  "Cross-Body Shoulder Stretch":["Einen gestreckten Arm vor die Brust führen und knapp über dem Ellbogen halten.",["Arm auf Brusthöhe vor den Körper","Andere Hand über dem Ellbogen","Schulter unten lassen"],["Schulter hochziehen","Oberkörper mitdrehen"]],
  "Overhead Triceps Stretch":["Eine Hand den oberen Rücken hinab, mit der anderen Hand den Ellbogen sanft führen.",["Ellbogen hoch, Hand den Rücken hinab","Andere Hand am Ellbogen","Rippen unten, Kopf aufrecht"],["Hohlkreuz","Nacken nach vorne schieben"]],
  "Cobra Stretch":["In Bauchlage sanft über die Hände hochdrücken, Hüfte bleibt am Boden.",["Hände unter den Schultern","Langsam hochdrücken, Hüfte bleibt unten","Schultern unten, Nacken lang"],["In Rückenschmerz drücken","Schultern hochziehen"]]
});
Object.assign(DE.steps, {
  warmCardio:[["Gerät wählen","Rad, Rudergerät, Laufband, StairMaster – oder zügig gehen."],["Locker starten","Eine Anstrengung, bei der du dich unterhalten kannst."],["Locker bleiben","Schultern locker, gleichmäßig atmen."],["Leicht steigern","In der letzten Minute etwas schneller."],["Bereit","Du solltest warm sein, nicht müde."]],
  legSwing:[["Festhalten","Aufrecht neben einer Wand, eine Hand daran."],["Vor und zurück","Das äußere Bein vor und zurück schwingen."],["Größer werden","Jeden Schwung etwas größer werden lassen."],["Seitlich","Zur Wand drehen und das Bein quer und nach außen schwingen."],["Wechseln","Mit dem anderen Bein wiederholen."]],
  armCircle:[["Arme raus","Aufrecht, Arme seitlich ausgestreckt."],["Kleine Kreise","Mit kleinen Kreisen vorwärts beginnen."],["Größer","Die Kreise größer werden lassen."],["Rückwärts","Genauso rückwärts kreisen."],["Lockern","Arme ausschütteln."]],
  catCow:[["Vierfüßler","Hände unter den Schultern, Knie unter der Hüfte."],["Katze","Ausatmen und den ganzen Rücken rund machen."],["Kuh","Einatmen, Bauch sinken lassen, Brust heben."],["Fließen","Langsam zwischen beiden wechseln."],["Ganze Wirbelsäule","Bewegung vom Nacken bis zum Steißbein spüren."]],
  butterfly:[["Aufrecht sitzen","Mit geradem Rücken auf den Boden setzen."],["Fußsohlen zusammen","Knie beugen, Fußsohlen aneinander."],["Füße halten","Hände um Füße oder Knöchel."],["Heranziehen","Füße sanft heranziehen, bis die Innenschenkel dehnen."],["Atmen","Halten und die Knie tiefer entspannen lassen."]],
  seatTwist:[["Beine lang","Mit beiden Beinen gestreckt sitzen."],["Überkreuzen","Ein Bein beugen, Fuß auf die andere Seite des gestreckten Knies."],["Stützen","Hintere Hand hinter dir am Boden."],["Hinüberdrücken","Gegenarm drückt das gebeugte Knie hinüber, bis das Gesäß dehnt."],["Wechseln","Lösen und Seite wechseln."]],
  seatHam:[["Position","Ein Bein gestreckt, der andere Fuß am Innenschenkel."],["Aufrecht","Die Wirbelsäule lang machen."],["Beugen","Aus der Hüfte nach vorne beugen."],["Greifen","Hände gleiten am Bein entlang, bis der Oberschenkel hinten dehnt."],["Wechseln","Lösen und Seite wechseln."]],
  kneeChest:[["Hinlegen","Auf den Rücken legen."],["Knie heben","Ein Knie zu dir beugen."],["Umfassen","Hände um das Schienbein oder hinter den Oberschenkel."],["Heranziehen","Sanft ziehen, bis Hüfte und Gesäß dehnen."],["Variante","Anderes Bein gestreckt oder gebeugt – dann wechseln."]],
  wallHam:[["Türöffnung","Neben einen Türrahmen oder eine Wandecke auf den Rücken legen."],["Bein hoch","Ein Bein an die Wand, das andere lang am Boden."],["Spüren","Hüfte näher rücken, bis der Oberschenkel hinten dehnt."],["Näher","Wenn es nachgibt, etwas näher rutschen."],["Lösen","Zurückrutschen, Bein senken, wechseln."]],
  lowLunge:[["Tiefer Ausfallschritt","Einen Fuß nach vorne, Fingerspitzen am Boden."],["Hinteres Bein lang","Hinteres Bein nach hinten strecken."],["Brust hoch","Brust heben, Rücken leicht gestreckt."],["Sinken","Hüfte nach unten und vorne sinken lassen."],["Wechseln","Lösen und Seite wechseln."]],
  standHam:[["Aufsetzen","Eine Ferse auf eine niedrige, stabile Stufe."],["Hüfte gerade","Standknie locker, Hüfte zeigt nach vorne."],["Beugen","Mit langem Rücken aus der Hüfte vorbeugen."],["Hände gleiten","Hände am Bein hinab, bis es dehnt."],["Wechseln","Lösen und Seite wechseln."]],
  outerHip:[["Aufrecht","Hände an der Hüfte; bei Bedarf an die Wand."],["Kreuzen","Ein Bein vor dem anderen kreuzen."],["Lehnen","Hüfte hinaus, Oberkörper zur Seite."],["Spüren","Die Dehnung liegt außen an der Hüfte."],["Wechseln","Lösen und Seite wechseln."]],
  soleus:[["An die Wand","Zur Wand, Hände auf Schulterhöhe."],["Zurücktreten","Einen Fuß zurück, Ferse unten."],["Beugen","Beide Knie beugen."],["Lehnen","Hineinlehnen, bis die untere Wade dehnt."],["Wechseln","Lösen und Seite wechseln."]],
  quad:[["Gleichgewicht","Aufrecht, eine Hand an der Wand."],["Knöchel greifen","Ein Knie beugen, Knöchel hinten halten."],["Knie zusammen","Die Knie nebeneinander halten."],["Einrollen","Becken leicht einrollen für mehr Dehnung."],["Wechseln","Lösen und Seite wechseln."]],
  pigeon:[["Vorderes Schienbein","Ein Schienbein quer vor dich legen."],["Hinteres Bein lang","Das andere Bein gerade nach hinten schieben."],["Ausrichten","Hüfte gerade halten."],["Senken","Hände nach vorne, Brust entspannt absenken."],["Wechseln","Langsam lösen und Seite wechseln."]],
  crossArm:[["Arm vor","Einen gestreckten Arm vor die Brust führen."],["Halten","Andere Hand knapp über dem Ellbogen."],["Schulter unten","Schulter weg vom Ohr."],["Heranziehen","Sanft ziehen, bis die hintere Schulter dehnt."],["Wechseln","Lösen und Seite wechseln."]],
  triceps:[["Ellbogen hoch","Einen Arm heben und den Ellbogen beugen."],["Hand runter","Hand den oberen Rücken hinab."],["Führen","Andere Hand schiebt den Ellbogen sanft zurück."],["Aufrecht","Rippen unten, Nacken locker."],["Wechseln","Lösen und Seite wechseln."]],
  cobra:[["Bauchlage","Hände unter den Schultern, Beine lang."],["Hochdrücken","Arme langsam teilweise strecken."],["Hüfte unten","Hüfte bleibt am Boden."],["Schultern unten","Nacken lang, Schultern weg von den Ohren."],["Absenken","Langsam wieder ablegen."]]
});
Object.assign(DE.feel, {warmCardio:"Warm, etwas schnellere Atmung, locker.", legSwing:"Die Hüfte wird mit jedem Schwung freier.", armCircle:"Die Schultern werden warm.",
  catCow:"Die ganze Wirbelsäule bewegt sich sanft.", butterfly:"Innenschenkel.", seatTwist:"Gesäß und äußere Hüfte.", seatHam:"Die Rückseite des Oberschenkels.",
  kneeChest:"Hüfte und Gesäß.", wallHam:"Die Rückseite des Oberschenkels, die mit der Zeit nachgibt.", lowLunge:"Die Vorderseite der Hüfte des hinteren Beins.",
  standHam:"Die Rückseite des Oberschenkels.", outerHip:"Die Außenseite der Hüfte.", soleus:"Die untere Wade nahe der Achillessehne.", quad:"Die Vorderseite des Oberschenkels.",
  pigeon:"Gesäß und äußere Hüfte des vorderen Beins.", crossArm:"Die Rückseite der Schulter.", triceps:"Die Rückseite des Oberarms.", cobra:"Die Vorderseite des Rumpfes; eine sanfte Rückbeuge."});
Object.assign(VIDEO_SEARCH, {"Easy Cardio Warm-up":"5 minute gym warm up cardio", "Leg Swings":"leg swings dynamic warm up", "Arm Circles":"arm circles warm up",
  "Cat-Cow":"cat cow stretch how to", "Butterfly Stretch":"butterfly stretch groin how to", "Seated Twist Glute Stretch":"seated spinal twist glute stretch",
  "Seated Hamstring Reach":"seated single leg hamstring stretch", "Knee-to-Chest Stretch":"knee to chest stretch lower back", "Wall Hamstring Stretch":"doorway hamstring stretch lying",
  "Low Lunge Hip Flexor Stretch":"low lunge hip flexor stretch", "Standing Hamstring Stretch":"standing hamstring stretch on step", "Standing Outer Hip Stretch":"standing IT band stretch cross leg lean",
  "Bent-Knee Calf Stretch":"soleus stretch bent knee wall", "Standing Quad Stretch":"standing quad stretch proper form", "Pigeon Stretch":"pigeon stretch beginner",
  "Cross-Body Shoulder Stretch":"cross body shoulder stretch", "Overhead Triceps Stretch":"overhead triceps stretch", "Cobra Stretch":"cobra stretch lower back gentle"});

/* ---------- which drills and stretches go with which session ---------- */
const WARMUP_DRILLS = {
  lower:["Leg Swings","World's Greatest Stretch","Hip 90/90 Flow","Ankle Dorsiflexion Rock","Deep Squat Pry","Cossack Squat"],
  upper:["Arm Circles","Cat-Cow","Thoracic Rotation","Band Shoulder Dislocates","Inchworm to Down Dog"],
  full:["World's Greatest Stretch","Leg Swings","Arm Circles","Cat-Cow","Inchworm to Down Dog","Hip 90/90 Flow"],
  engine:["Leg Swings","World's Greatest Stretch","Arm Circles","Inchworm to Down Dog"],
  mobility:["Cat-Cow","Hip 90/90 Flow","Thoracic Rotation","World's Greatest Stretch","Leg Swings","Arm Circles"]
};
const COOLDOWN_STRETCHES = {
  lower:["Low Lunge Hip Flexor Stretch","Seated Hamstring Reach","Figure-4 Glute Stretch","Standing Quad Stretch","Butterfly Stretch","Bent-Knee Calf Stretch",
         "Wall Hamstring Stretch","Pigeon Stretch","Standing Outer Hip Stretch","Knee-to-Chest Stretch","Couch Stretch","Calf Wall Stretch","Standing Hamstring Stretch","Adductor Rockback Stretch"],
  upper:["Doorway Pec Stretch","Child's Pose Lat Stretch","Cross-Body Shoulder Stretch","Overhead Triceps Stretch","Cobra Stretch"],
  full:["Low Lunge Hip Flexor Stretch","Doorway Pec Stretch","Seated Hamstring Reach","Child's Pose Lat Stretch","Figure-4 Glute Stretch","Cross-Body Shoulder Stretch",
        "Standing Quad Stretch","Knee-to-Chest Stretch","Bent-Knee Calf Stretch"],
  engine:["Standing Quad Stretch","Low Lunge Hip Flexor Stretch","Bent-Knee Calf Stretch","Seated Hamstring Reach","Child's Pose Lat Stretch","Standing Outer Hip Stretch"],
  mobility:["Pigeon Stretch","Butterfly Stretch","Seated Twist Glute Stretch","Wall Hamstring Stretch","Low Lunge Hip Flexor Stretch","Cobra Stretch",
            "Cross-Body Shoulder Stretch","Knee-to-Chest Stretch","Standing Outer Hip Stretch","Doorway Pec Stretch"]
};
const WARM_COOL = {45:[1,2], 60:[1,2], 75:[2,3], 90:[2,4]};     // [drills, stretches] by session length
/* Safety: stretches / drills that load a sore area are swapped for gentler ones. */
Object.entries({
  knees:["Pigeon Stretch","Low Lunge Hip Flexor Stretch","Standing Quad Stretch","Cossack Squat","Deep Squat Pry"],
  hips:["Pigeon Stretch","Butterfly Stretch"],
  lowerBack:["Cobra Stretch","Seated Twist Glute Stretch"],
  shoulders:["Overhead Triceps Stretch","Band Shoulder Dislocates"],
  wrists:["Cat-Cow","Inchworm to Down Dog","Low Lunge Hip Flexor Stretch"],
  neck:["Cobra Stretch"]
}).forEach(([k, list]) => { AVOID_BY_AREA[k] = [...(AVOID_BY_AREA[k] || []), ...list]; });
