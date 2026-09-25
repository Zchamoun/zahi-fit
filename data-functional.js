"use strict";
/* Zahi Fit v5.2 — barbell, trap bar, pull-up, Hyrox & CrossFit exercises + "Training style" pools.
   Loaded after data.js, data-de.js, data-plan.js, data-video.js, data-profile.js. */

/* E(name, block, sets, reps, rest, cue, video, how, mistakes, subs) */
const FUNCTIONAL = [
E("Back Squat","Strength",4,"6",150,"Bar on your upper back, brace hard, sit down between your hips and drive up.","",["Bar on the upper traps, hands just outside the shoulders","Big breath and brace before each rep","Knees track over the toes, chest up"],["Heels lifting","Rounding the lower back at the bottom"],["Front Squat","Leg Press"]),
E("Trap Bar Deadlift","Strength",4,"5",150,"Stand in the middle of the bar, push the floor away and stand tall.","",["Feet hip-width in the centre of the bar","Grip the handles, chest up, back flat","Push the floor away until you stand tall"],["Hips shooting up first","Jerking the bar off the floor"],["Deadlift","Kettlebell Deadlift"]),
E("Barbell Romanian Deadlift","Hypertrophy",3,"8",120,"Soft knees, push the hips back and slide the bar down your thighs.","",["Start standing with the bar","Hips back, bar close to the legs","Stop when the hamstrings are stretched"],["Rounding the back","Bending the knees like a squat"],["Dumbbell Romanian Deadlift","Hip Thrust"]),
E("Barbell Row","Strength",4,"8",120,"Hinge forward with a flat back and row the bar to your lower ribs.","",["Hinge to about 45° with a flat back","Pull elbows back toward the hips","Lower under control"],["Standing up to swing the weight","Shrugging the shoulders"],["Chest-Supported Row","Single-Arm Cable Row"]),
E("Overhead Press","Strength",4,"6",150,"Squeeze glutes, press the bar straight up and bring your head through at the top.","",["Bar on the front of the shoulders","Glutes and trunk tight, ribs down","Head moves back, then through at the top"],["Leaning back into an arch","Pressing the bar forward instead of up"],["Dumbbell Shoulder Press","Pike Push-up"]),
E("Pull-up","Strength",4,"5–10",120,"From a dead hang, pull your chest to the bar and lower all the way down.","",["Grip just wider than the shoulders","Pull the shoulder blades down first","Chin over the bar, lower to straight arms"],["Kipping or swinging","Half reps without full hang"],["Lat Pulldown","Inverted Row"]),
E("Power Clean","Power",5,"3",120,"Push the floor, jump the bar up with your hips and catch it high on the shoulders.","",["Start like a deadlift, bar over mid-foot","Explode hips and knees, shrug high","Fast elbows under, catch in a quarter squat"],["Pulling with the arms early","Catching with the elbows down"],["Kettlebell Swing","Trap Bar Deadlift"]),
E("Thruster","Power",4,"8",90,"Front squat and press overhead in one smooth movement.","",["Bar or dumbbells on the shoulders","Squat down with the chest up","Drive up and press overhead in one motion"],["Pausing between squat and press","Elbows dropping at the bottom"],["Dumbbell Shoulder Press","Front Squat"]),
E("Box Jump","Power",4,"5",75,"Swing, jump up soft, stand tall on the box and step down.","",["Stand a foot from the box","Swing the arms and jump","Land softly in a squat, stand tall, step down"],["Jumping down repeatedly","Landing with knees caving in"],["Jump Squat","Kettlebell Swing"]),
E("Wall Balls","Power",5,"15",60,"Squat with the ball, drive up and throw it to the target, catch and repeat.","",["Ball at the chest, feet shoulder-width","Full squat, then drive up hard","Throw to the target and catch into the next squat"],["Shallow squats","Throwing with the arms only"],["Thruster","Kettlebell Swing"]),
E("Battle Ropes","Conditioning",8,"30 s on / 30 s off",0,"Fast, powerful waves from a solid athletic stance.","",["Athletic stance, knees soft","Brace the trunk","Drive fast waves from the shoulders and hips"],["Standing tall and stiff","Only using the wrists"],["Burpee Intervals","Bike Intervals"]),
E("Burpee Broad Jump","Conditioning",5,"10 reps",60,"Burpee down, stand, then jump forward and land softly.","",["Chest to floor","Jump the feet in and stand","Broad jump forward, land softly, repeat"],["Racing the first rounds","Landing stiff-legged"],["Burpee Intervals","Jump Squat"]),
E("Rowing Intervals","Conditioning",6,"500 m hard / 2 min easy",0,"Legs, then body, then arms — and back the other way.","",["Drive with the legs first","Lean back slightly, then pull to the ribs","Arms, body, then legs on the way back"],["Pulling with the arms first","Rounding the back"],["Bike Intervals","SkiErg Intervals"]),
E("SkiErg Intervals","Conditioning",6,"250 m hard / 1 min easy",0,"Pull the handles down with your whole body, hinge at the hips and stand tall.","",["Arms high, stand tall","Pull down while hinging at the hips","Return tall with arms reaching up"],["Squatting deep instead of hinging","Using the arms only"],["Rowing Intervals","Battle Ropes"]),
E("Sled Push","Conditioning",4,"25 m",90,"Low body angle, arms locked, drive with short powerful steps.","",["Hands on the posts, arms straight or bent","Lean forward at about 45°","Short, powerful steps through the balls of the feet"],["Standing too upright","Long, slow strides"],["Farmer Carry","Walking Dumbbell Lunge"]),
E("Sled Pull","Conditioning",4,"25 m",90,"Sit low and pull the rope hand over hand to bring the sled to you.","",["Sit into a low athletic stance","Pull hand over hand with the back and arms","Keep the rope tight"],["Rounding the back","Standing up straight"],["Barbell Row","Chest-Supported Row"]),
E("Sandbag Lunges","Hypertrophy",3,"20 m",90,"Sandbag on the shoulders, walking lunges with the back knee to the floor.","",["Bag across the upper back","Long step, back knee touches lightly","Drive through the front foot"],["Short steps","Leaning far forward"],["Walking Dumbbell Lunge","Reverse Lunge"]),
E("Jump Rope Intervals","Conditioning",8,"40 s on / 20 s off",0,"Light bounces on the balls of the feet, wrists turn the rope.","",["Elbows close to the body","Small, quick jumps","Turn the rope with the wrists"],["Jumping too high","Swinging with the arms"],["High-Knee Intervals","Battle Ropes"]),
E("Hyrox Station Circuit","Conditioning",3,"500 m row · 25 m sled push · 10 burpee broad jumps · 20 wall balls · 50 m farmers carry",120,"A steady race pace you could hold for all rounds.","",["Pace round one conservatively","Move straight to the next station","Clean reps even when tired"],["Sprinting the first station","Skipping the rest between rounds"],["CrossFit Engine Circuit","Rowing Intervals"])
];
["Pull-up","Box Jump","Burpee Broad Jump","Jump Rope Intervals"].forEach(n => { const x = FUNCTIONAL.find(e => e.n === n); if(x) x.bw = true; });
EXTRA.push(...FUNCTIONAL);
["Pull-up","Box Jump","Burpee Broad Jump","Jump Rope Intervals"].forEach(n => BW_NAMES.add(n));

Object.assign(FAMILY, {"Back Squat":"backSquat", "Trap Bar Deadlift":"trapBar", "Barbell Romanian Deadlift":"bbRdl", "Barbell Row":"bbRow",
  "Overhead Press":"ohp", "Pull-up":"pullup", "Power Clean":"clean", "Thruster":"thruster", "Box Jump":"boxJump", "Wall Balls":"wallBall",
  "Battle Ropes":"ropes", "Burpee Broad Jump":"bbj", "Rowing Intervals":"row", "SkiErg Intervals":"ski", "Sled Push":"sledPush",
  "Sled Pull":"sledPull", "Sandbag Lunges":"sandbag", "Jump Rope Intervals":"jumpRope", "Hyrox Station Circuit":"hyrox"});

Object.assign(STEPS, {
  backSquat:[["Set the bar","Bar in the rack at chest height; step under and place it on your upper back."],["Unrack and brace","Stand up, take two steps back, big breath and tighten the trunk."],["Sit down","Bend hips and knees together, knees over the toes, chest up."],["Reach depth","Go to at least parallel with a flat back and heels down."],["Drive up","Push the floor away and stand tall; breathe out at the top."]],
  trapBar:[["Step in","Stand in the centre of the trap bar, feet hip-width."],["Grip and set","Hinge down, grip the handles, chest up, back flat."],["Brace","Big breath, pull the slack out of the bar."],["Push the floor","Drive through the whole foot until you stand tall."],["Lower","Hinge back down with control and reset."]],
  bbRdl:[["Start tall","Hold the bar at your hips, shoulder-width grip."],["Soft knees","Unlock the knees slightly and keep them there."],["Hips back","Push the hips back, bar sliding down the thighs."],["Feel the stretch","Stop when the hamstrings are tight, back still flat."],["Stand up","Drive the hips forward and squeeze the glutes."]],
  bbRow:[["Set up","Hold the bar with a shoulder-width grip."],["Hinge","Hinge to about 45°, back flat, knees soft."],["Row","Pull the bar to the lower ribs, elbows going back."],["Squeeze","Pause and squeeze the shoulder blades together."],["Lower","Lower under control without standing up."]],
  ohp:[["Front rack","Bar on the front of the shoulders, grip just outside them."],["Tighten up","Squeeze glutes and trunk, ribs pulled down."],["Press","Press straight up, moving your head back out of the way."],["Lock out","Bring your head through; bar over the middle of your feet."],["Lower","Lower to the shoulders with control."]],
  pullup:[["Hang","Grip just wider than the shoulders and hang with straight arms."],["Set the shoulders","Pull the shoulder blades down and back."],["Pull","Drive the elbows down until your chin clears the bar."],["Pause","Hold briefly at the top without swinging."],["Lower fully","Lower all the way to straight arms. Use a band if needed."]],
  clean:[["Set up","Bar over mid-foot, grip just outside the knees, back flat."],["First pull","Push the floor and lift the bar past the knees."],["Explode","Jump the hips and knees open, shrug high."],["Catch","Pull under fast, elbows up, catch on the shoulders in a quarter squat."],["Stand","Stand tall, then lower the bar with control."]],
  thruster:[["Front rack","Bar or dumbbells on the shoulders, elbows high."],["Squat","Sit down to at least parallel, chest up."],["Drive","Explode up through the legs."],["Press","Use that drive to press overhead in one motion."],["Return","Bring the weight to the shoulders into the next squat."]],
  boxJump:[["Stand close","About a foot from the box, feet hip-width."],["Load","Swing the arms back and dip the hips."],["Jump","Swing the arms up and jump onto the box."],["Land soft","Land quietly in a squat, knees out."],["Stand and step down","Stand tall, then step down — don't jump down."]],
  wallBall:[["Hold the ball","Ball at the chest, feet shoulder-width, facing the wall."],["Squat","Sit into a full squat, chest up."],["Drive","Stand up explosively."],["Throw","Throw the ball to the target line using the leg drive."],["Catch","Catch it and flow straight into the next squat."]],
  ropes:[["Grip","Hold one end in each hand, rope slightly slack."],["Stance","Feet shoulder-width, knees bent, hips back."],["Brace","Tighten the trunk and keep the chest up."],["Waves","Drive fast alternating or double waves from the shoulders."],["Keep rhythm","Keep the waves reaching the anchor for the whole interval."]],
  bbj:[["Burpee down","Hands down, jump back and lower the chest to the floor."],["Jump in","Push up and jump the feet toward the hands."],["Stand","Rise into an athletic stance."],["Broad jump","Swing the arms and jump forward as far as is controlled."],["Land and repeat","Land softly on both feet and go straight into the next burpee."]],
  row:[["Set up","Feet strapped in, strap across the widest part of the foot."],["Catch","Shins vertical, arms long, leaning slightly forward."],["Drive","Push with the legs first, then lean back slightly."],["Finish","Pull the handle to the lower ribs."],["Recover","Arms away, body forward, then bend the knees."]],
  ski:[["Stand tall","Hold the handles high, feet hip-width."],["Pull","Drive the handles down while hinging at the hips."],["Finish","Hands pass the hips, knees soft."],["Return","Stand tall and reach the arms back up."],["Rhythm","Find a strong, repeatable stroke rate."]],
  sledPush:[["Hands on","Hands on the posts, arms locked or bent."],["Lean","Lean forward to about 45°, back flat."],["Drive","Push with short, powerful steps."],["Stay low","Keep the hips low and the body angle fixed."],["Keep moving","Don't stop — restarting a heavy sled is hardest."]],
  sledPull:[["Grab the rope","Face the sled, rope in both hands."],["Sit low","Drop into an athletic stance, hips back."],["Pull","Pull hand over hand using back and arms."],["Stay tight","Keep the trunk braced and the rope tight."],["Finish","Walk back as needed and repeat."]],
  sandbag:[["Load the bag","Bag across the upper back or shoulders."],["Step long","Take a long step forward."],["Lower","Lower until the back knee lightly touches the floor."],["Drive","Push through the front foot to step through."],["Keep going","Alternate legs for the full distance."]],
  jumpRope:[["Handles","Hold the handles, elbows close to the body."],["Start","Swing the rope over and hop as it comes under."],["Bounce","Small bounces on the balls of the feet."],["Wrists","Turn the rope with the wrists, not the arms."],["Breathe","Stay relaxed and keep a steady rhythm."]],
  hyrox:[["Set the stations","Set up the rower, sled, wall ball and carry weights in order."],["Start steady","Round one at a pace you could hold for all rounds."],["Move straight on","Go from station to station without long breaks."],["Clean reps","Full range on every burpee and wall ball."],["Rest and repeat","Rest two minutes between rounds and repeat."]]
});
Object.assign(FEEL_EXTRA, {
  backSquat:"Quads and glutes driving, trunk braced hard.", trapBar:"Legs, glutes and back working together; grip holding firm.",
  bbRdl:"A strong hamstring stretch and glute squeeze.", bbRow:"Upper back and lats pulling, trunk holding still.",
  ohp:"Shoulders and triceps pressing, glutes and trunk tight.", pullup:"Lats and upper back pulling you up.",
  clean:"Explosive hips and legs; the bar feels light when the timing is right.", thruster:"Legs and shoulders together; heart rate climbs fast.",
  boxJump:"Springy leg power and quiet landings.", wallBall:"Legs, shoulders and lungs — rhythm matters.",
  ropes:"Shoulders, arms and trunk burning; breathing hard.", bbj:"Whole-body effort, legs and lungs.",
  row:"Legs driving most of each stroke, back and arms finishing.", ski:"Lats, trunk and hips pulling together.",
  sledPush:"Legs and glutes driving, heart rate high.", sledPull:"Back, arms and grip working, legs anchored.",
  sandbag:"Quads and glutes, balance and trunk control.", jumpRope:"Calves and lungs; light, quick feet.",
  hyrox:"Race-style whole-body work at a steady, repeatable pace."
});

/* ---------- German ---------- */
Object.assign(DE.names, {"Back Squat":"Kniebeuge mit Langhantel", "Trap Bar Deadlift":"Kreuzheben mit Trap Bar", "Barbell Romanian Deadlift":"Rumänisches Kreuzheben mit Langhantel",
  "Barbell Row":"Langhantelrudern", "Overhead Press":"Schulterdrücken stehend", "Pull-up":"Klimmzug", "Power Clean":"Power Clean", "Thruster":"Thruster",
  "Box Jump":"Box Jump", "Wall Balls":"Wall Balls", "Battle Ropes":"Battle Ropes", "Burpee Broad Jump":"Burpee mit Weitsprung", "Rowing Intervals":"Rudergerät-Intervalle",
  "SkiErg Intervals":"SkiErg-Intervalle", "Sled Push":"Schlitten schieben", "Sled Pull":"Schlitten ziehen", "Sandbag Lunges":"Ausfallschritte mit Sandsack",
  "Jump Rope Intervals":"Seilspring-Intervalle", "Hyrox Station Circuit":"Hyrox-Stationszirkel"});
Object.assign(DE.ex, {
  "Back Squat":["Stange auf dem oberen Rücken, fest anspannen, zwischen die Hüften setzen und hochdrücken.",["Stange auf dem oberen Trapez, Hände knapp außerhalb der Schultern","Vor jeder Wiederholung tief einatmen und anspannen","Knie über den Zehen, Brust oben"],["Fersen heben ab","Unterer Rücken rundet sich unten"]],
  "Trap Bar Deadlift":["In der Mitte der Stange stehen, den Boden wegdrücken und aufrecht hinstellen.",["Füße hüftbreit mittig in der Stange","Griffe fassen, Brust oben, Rücken gerade","Boden wegdrücken bis zum aufrechten Stand"],["Hüfte schießt zuerst hoch","Stange ruckartig vom Boden reißen"]],
  "Barbell Romanian Deadlift":["Knie leicht gebeugt, Hüfte nach hinten und die Stange an den Oberschenkeln hinabgleiten lassen.",["Aufrecht mit der Stange starten","Hüfte nach hinten, Stange nah an den Beinen","Stopp, wenn die Beinbeuger gedehnt sind"],["Rücken rund","Knie beugen wie bei einer Kniebeuge"]],
  "Barbell Row":["Mit geradem Rücken vorbeugen und die Stange zu den unteren Rippen ziehen.",["Etwa 45° vorbeugen, Rücken gerade","Ellbogen Richtung Hüfte ziehen","Kontrolliert ablassen"],["Aufrichten, um Schwung zu holen","Schultern hochziehen"]],
  "Overhead Press":["Gesäß anspannen, Stange gerade nach oben drücken und oben den Kopf durchschieben.",["Stange vorne auf den Schultern","Gesäß und Rumpf fest, Rippen unten","Kopf erst zurück, oben durch"],["Ins Hohlkreuz lehnen","Stange nach vorne statt nach oben drücken"]],
  "Pull-up":["Aus dem ruhigen Hang die Brust zur Stange ziehen und ganz ablassen.",["Griff etwas breiter als schulterbreit","Zuerst die Schulterblätter nach unten ziehen","Kinn über die Stange, bis zu gestreckten Armen ablassen"],["Schwung holen (Kipping)","Halbe Wiederholungen ohne vollen Hang"]],
  "Power Clean":["Boden wegdrücken, die Stange mit der Hüfte hochspringen lassen und hoch auf den Schultern fangen.",["Start wie Kreuzheben, Stange über dem Mittelfuß","Hüfte und Knie explosiv strecken, hoch shruggen","Schnell mit den Ellbogen drunter, in der Viertelkniebeuge fangen"],["Zu früh mit den Armen ziehen","Mit gesenkten Ellbogen fangen"]],
  "Thruster":["Frontkniebeuge und Drücken über Kopf in einer fließenden Bewegung.",["Stange oder Kurzhanteln auf den Schultern","Mit aufrechter Brust tief setzen","Hochdrücken und in einer Bewegung über Kopf drücken"],["Pause zwischen Kniebeuge und Drücken","Ellbogen fallen unten ab"]],
  "Box Jump":["Schwung holen, weich auf die Box springen, aufrecht stehen und heruntersteigen.",["Etwa einen Fuß vor der Box stehen","Arme schwingen und springen","Weich in der Hocke landen, aufrichten, heruntersteigen"],["Wiederholt herunterspringen","Landung mit einknickenden Knien"]],
  "Wall Balls":["Mit dem Ball tief gehen, hochdrücken und zum Ziel werfen, fangen und wiederholen.",["Ball vor der Brust, Füße schulterbreit","Volle Kniebeuge, dann kräftig hoch","Zum Ziel werfen und direkt in die nächste Kniebeuge fangen"],["Zu flache Kniebeugen","Nur mit den Armen werfen"]],
  "Battle Ropes":["Schnelle, kräftige Wellen aus einem stabilen Athletikstand.",["Athletikstand, Knie weich","Rumpf anspannen","Schnelle Wellen aus Schultern und Hüfte"],["Steif und aufrecht stehen","Nur aus den Handgelenken arbeiten"]],
  "Burpee Broad Jump":["Burpee nach unten, aufstehen, dann nach vorne springen und weich landen.",["Brust zum Boden","Füße heranspringen und aufstehen","Nach vorne springen, weich landen, wiederholen"],["Die ersten Runden zu schnell","Mit gestreckten Beinen landen"]],
  "Rowing Intervals":["Erst Beine, dann Oberkörper, dann Arme – und in umgekehrter Reihenfolge zurück.",["Zuerst mit den Beinen drücken","Leicht zurücklehnen, dann zu den Rippen ziehen","Zurück: Arme, Oberkörper, dann Beine"],["Zuerst mit den Armen ziehen","Runder Rücken"]],
  "SkiErg Intervals":["Die Griffe mit dem ganzen Körper nach unten ziehen, aus der Hüfte beugen und aufrecht zurückkommen.",["Arme hoch, aufrecht stehen","Nach unten ziehen und aus der Hüfte beugen","Aufrecht zurück, Arme strecken"],["Tief hocken statt beugen","Nur mit den Armen ziehen"]],
  "Sled Push":["Tiefer Körperwinkel, Arme fest, mit kurzen kräftigen Schritten schieben.",["Hände an den Stangen, Arme gestreckt oder gebeugt","Etwa 45° nach vorne lehnen","Kurze, kräftige Schritte über die Fußballen"],["Zu aufrecht stehen","Lange, langsame Schritte"]],
  "Sled Pull":["Tief setzen und das Seil Hand über Hand ziehen, bis der Schlitten bei dir ist.",["In einen tiefen Athletikstand gehen","Hand über Hand mit Rücken und Armen ziehen","Seil gespannt halten"],["Runder Rücken","Aufrecht stehen"]],
  "Sandbag Lunges":["Sandsack auf den Schultern, gehende Ausfallschritte, hinteres Knie bis knapp zum Boden.",["Sack quer über den oberen Rücken","Langer Schritt, hinteres Knie berührt leicht","Über den vorderen Fuß hochdrücken"],["Zu kurze Schritte","Weit nach vorne lehnen"]],
  "Jump Rope Intervals":["Leichte Sprünge auf den Fußballen, das Seil drehen die Handgelenke.",["Ellbogen nah am Körper","Kleine, schnelle Sprünge","Seil aus den Handgelenken drehen"],["Zu hoch springen","Mit den Armen schwingen"]],
  "Hyrox Station Circuit":["Ein gleichmäßiges Renntempo, das du alle Runden halten kannst.",["Erste Runde bewusst ruhig","Direkt zur nächsten Station","Saubere Wiederholungen auch bei Müdigkeit"],["Die erste Station sprinten","Pause zwischen den Runden auslassen"]]
});
Object.assign(DE.steps, {
  backSquat:[["Stange einstellen","Stange im Rack auf Brusthöhe; darunter treten und auf den oberen Rücken legen."],["Ausheben und anspannen","Aufstehen, zwei Schritte zurück, tief einatmen, Rumpf anspannen."],["Absetzen","Hüfte und Knie gleichzeitig beugen, Knie über den Zehen, Brust oben."],["Tiefe erreichen","Mindestens bis parallel, Rücken gerade, Fersen unten."],["Hochdrücken","Boden wegdrücken und aufrecht stehen; oben ausatmen."]],
  trapBar:[["Einsteigen","Mittig in die Trap Bar stellen, Füße hüftbreit."],["Greifen","Aus der Hüfte beugen, Griffe fassen, Brust oben, Rücken gerade."],["Anspannen","Tief einatmen, Spannung in die Stange bringen."],["Boden wegdrücken","Über den ganzen Fuß drücken, bis du aufrecht stehst."],["Ablassen","Kontrolliert aus der Hüfte absenken und neu ansetzen."]],
  bbRdl:[["Aufrecht starten","Stange an der Hüfte, schulterbreiter Griff."],["Weiche Knie","Knie leicht beugen und so halten."],["Hüfte nach hinten","Hüfte zurückschieben, Stange gleitet die Oberschenkel hinab."],["Dehnung spüren","Stopp, wenn die Beinbeuger gespannt sind, Rücken gerade."],["Aufrichten","Hüfte nach vorne schieben, Gesäß anspannen."]],
  bbRow:[["Position","Stange schulterbreit greifen."],["Vorbeugen","Etwa 45° vorbeugen, Rücken gerade, Knie weich."],["Rudern","Stange zu den unteren Rippen ziehen, Ellbogen nach hinten."],["Anspannen","Kurz halten, Schulterblätter zusammenziehen."],["Ablassen","Kontrolliert ablassen, ohne aufzurichten."]],
  ohp:[["Frontposition","Stange vorne auf den Schultern, Griff knapp außerhalb."],["Anspannen","Gesäß und Rumpf fest, Rippen nach unten."],["Drücken","Gerade nach oben drücken, Kopf dabei zurücknehmen."],["Ausstrecken","Kopf durch; Stange über der Fußmitte."],["Ablassen","Kontrolliert zu den Schultern zurück."]],
  pullup:[["Hängen","Etwas breiter als schulterbreit greifen und mit gestreckten Armen hängen."],["Schultern setzen","Schulterblätter nach unten und hinten ziehen."],["Ziehen","Ellbogen nach unten ziehen, bis das Kinn über der Stange ist."],["Halten","Oben kurz halten, ohne zu schwingen."],["Ganz ablassen","Bis zu gestreckten Armen ablassen. Bei Bedarf mit Band."]],
  clean:[["Position","Stange über dem Mittelfuß, Griff knapp außerhalb der Knie, Rücken gerade."],["Erster Zug","Boden wegdrücken und die Stange über die Knie heben."],["Explodieren","Hüfte und Knie explosiv öffnen, hoch shruggen."],["Fangen","Schnell drunter, Ellbogen hoch, in der Viertelkniebeuge auf den Schultern fangen."],["Aufrichten","Aufrecht stehen, dann kontrolliert ablassen."]],
  thruster:[["Frontposition","Stange oder Kurzhanteln auf den Schultern, Ellbogen hoch."],["Kniebeuge","Mindestens bis parallel setzen, Brust oben."],["Antrieb","Explosiv aus den Beinen hochdrücken."],["Drücken","Den Schwung nutzen und in einer Bewegung über Kopf drücken."],["Zurück","Gewicht zu den Schultern bringen und direkt in die nächste Kniebeuge."]],
  boxJump:[["Nah stehen","Etwa einen Fuß vor der Box, Füße hüftbreit."],["Ausholen","Arme nach hinten schwingen, Hüfte absenken."],["Springen","Arme nach oben schwingen und auf die Box springen."],["Weich landen","Leise in der Hocke landen, Knie nach außen."],["Aufrichten und heruntersteigen","Aufrecht stehen, dann heruntersteigen – nicht springen."]],
  wallBall:[["Ball halten","Ball vor der Brust, Füße schulterbreit, zur Wand."],["Kniebeuge","Tief setzen, Brust oben."],["Antrieb","Explosiv aufstehen."],["Werfen","Mit dem Beinschwung zur Ziellinie werfen."],["Fangen","Fangen und direkt in die nächste Kniebeuge."]],
  ropes:[["Griff","Je ein Ende pro Hand, Seil leicht locker."],["Stand","Füße schulterbreit, Knie gebeugt, Hüfte zurück."],["Anspannen","Rumpf fest, Brust oben."],["Wellen","Schnelle wechselnde oder doppelte Wellen aus den Schultern."],["Rhythmus halten","Die Wellen sollen das ganze Intervall bis zum Anker reichen."]],
  bbj:[["Burpee runter","Hände runter, zurückspringen, Brust zum Boden."],["Heranspringen","Hochdrücken und die Füße zu den Händen springen."],["Aufstehen","In den Athletikstand kommen."],["Weitsprung","Arme schwingen und kontrolliert nach vorne springen."],["Landen und weiter","Weich landen und direkt in den nächsten Burpee."]],
  row:[["Einstellen","Füße festgeschnallt, Riemen über der breitesten Stelle."],["Auslage","Schienbeine senkrecht, Arme lang, leicht vorgelehnt."],["Beindruck","Zuerst mit den Beinen drücken, dann leicht zurücklehnen."],["Endzug","Griff zu den unteren Rippen ziehen."],["Zurück","Arme weg, Oberkörper vor, dann Knie beugen."]],
  ski:[["Aufrecht stehen","Griffe hoch, Füße hüftbreit."],["Ziehen","Griffe nach unten ziehen und aus der Hüfte beugen."],["Endposition","Hände an der Hüfte vorbei, Knie weich."],["Zurück","Aufrichten und Arme wieder nach oben strecken."],["Rhythmus","Einen kräftigen, wiederholbaren Zugrhythmus finden."]],
  sledPush:[["Hände an","Hände an den Stangen, Arme fest oder gebeugt."],["Vorlehnen","Etwa 45° vorlehnen, Rücken gerade."],["Schieben","Mit kurzen, kräftigen Schritten schieben."],["Tief bleiben","Hüfte tief, Körperwinkel halten."],["In Bewegung bleiben","Nicht stoppen – ein schwerer Schlitten ist aus dem Stand am härtesten."]],
  sledPull:[["Seil greifen","Zum Schlitten schauen, Seil in beiden Händen."],["Tief setzen","In den Athletikstand, Hüfte zurück."],["Ziehen","Hand über Hand mit Rücken und Armen ziehen."],["Spannung halten","Rumpf fest, Seil gespannt."],["Abschließen","Bei Bedarf zurückgehen und wiederholen."]],
  sandbag:[["Sack aufnehmen","Sandsack quer über den oberen Rücken oder die Schultern."],["Langer Schritt","Einen langen Schritt nach vorne machen."],["Absenken","Absenken, bis das hintere Knie leicht den Boden berührt."],["Hochdrücken","Über den vorderen Fuß durchdrücken."],["Weitergehen","Beine abwechseln bis zur vollen Strecke."]],
  jumpRope:[["Griffe","Griffe halten, Ellbogen nah am Körper."],["Start","Seil überschwingen und springen, wenn es unten ist."],["Federn","Kleine Sprünge auf den Fußballen."],["Handgelenke","Seil aus den Handgelenken drehen, nicht aus den Armen."],["Atmen","Locker bleiben und gleichmäßig springen."]],
  hyrox:[["Stationen aufbauen","Rudergerät, Schlitten, Wall Ball und Tragegewichte der Reihe nach bereitstellen."],["Ruhig starten","Runde eins in einem Tempo, das du alle Runden halten kannst."],["Direkt weiter","Ohne lange Pausen von Station zu Station."],["Saubere Wiederholungen","Voller Bewegungsumfang bei jedem Burpee und Wall Ball."],["Pause und wiederholen","Zwei Minuten Pause zwischen den Runden, dann wiederholen."]]
});
Object.assign(DE.feel, {
  backSquat:"Oberschenkel und Gesäß arbeiten, der Rumpf ist fest angespannt.", trapBar:"Beine, Gesäß und Rücken arbeiten zusammen; der Griff hält fest.",
  bbRdl:"Deutliche Dehnung im Beinbeuger und Anspannung im Gesäß.", bbRow:"Oberer Rücken und Latissimus ziehen, der Rumpf bleibt ruhig.",
  ohp:"Schultern und Trizeps drücken, Gesäß und Rumpf sind fest.", pullup:"Latissimus und oberer Rücken ziehen dich hoch.",
  clean:"Explosive Hüfte und Beine; bei gutem Timing fühlt sich die Stange leicht an.", thruster:"Beine und Schultern zusammen; der Puls steigt schnell.",
  boxJump:"Federnde Beinkraft und leise Landungen.", wallBall:"Beine, Schultern und Lunge – der Rhythmus zählt.",
  ropes:"Schultern, Arme und Rumpf brennen; du atmest schwer.", bbj:"Ganzkörperbelastung, Beine und Lunge.",
  row:"Die Beine liefern den Großteil jedes Zuges, Rücken und Arme schließen ab.", ski:"Latissimus, Rumpf und Hüfte ziehen zusammen.",
  sledPush:"Beine und Gesäß schieben, der Puls ist hoch.", sledPull:"Rücken, Arme und Griff arbeiten, die Beine sind verankert.",
  sandbag:"Oberschenkel und Gesäß, Balance und Rumpfkontrolle.", jumpRope:"Waden und Lunge; leichte, schnelle Füße.",
  hyrox:"Ganzkörperarbeit im Wettkampfstil, gleichmäßig und wiederholbar."
});
/* Videos: a good YouTube search until fixed videos are chosen. */
Object.assign(VIDEO_SEARCH, {
  "Back Squat":"how to back squat barbell technique", "Trap Bar Deadlift":"how to trap bar deadlift technique", "Barbell Romanian Deadlift":"barbell romanian deadlift form",
  "Barbell Row":"barbell bent over row proper form", "Overhead Press":"barbell overhead press technique", "Pull-up":"how to do a pull up proper form",
  "Power Clean":"power clean technique beginner", "Thruster":"barbell thruster technique crossfit", "Box Jump":"box jump technique safe landing",
  "Wall Balls":"wall ball shot technique hyrox", "Battle Ropes":"battle ropes technique beginner", "Burpee Broad Jump":"burpee broad jump hyrox technique",
  "Rowing Intervals":"rowing machine technique concept2", "SkiErg Intervals":"skierg technique hyrox", "Sled Push":"sled push technique hyrox",
  "Sled Pull":"sled pull rope technique hyrox", "Sandbag Lunges":"sandbag lunges hyrox technique", "Jump Rope Intervals":"jump rope technique beginner",
  "Hyrox Station Circuit":"hyrox workout stations explained"
});

/* ---------- training style: Classic gym / Hyrox & CrossFit / Mix ---------- */
const STYLES = {mix:"Mix of both", classic:"Classic gym", functional:"Hyrox & CrossFit"};
const GYM_STRENGTH_ADD = {squat:["Back Squat"], hinge:["Trap Bar Deadlift","Barbell Romanian Deadlift"], ham:["Barbell Romanian Deadlift"],
  pullH:["Barbell Row"], pullV:["Pull-up"], pushV:["Overhead Press"]};
const FUNCTIONAL_POOLS = {
  power:["Box Jump","Wall Balls","Thruster","Power Clean","Kettlebell Swing"],
  interval:["Rowing Intervals","SkiErg Intervals","Battle Ropes","Burpee Intervals","Jump Rope Intervals","Bike Intervals","Treadmill Intervals"],
  circuit:["Hyrox Station Circuit","CrossFit Engine Circuit"],
  durability:["Sled Push","Sled Pull","Farmer Carry"],
  lunge:["Sandbag Lunges"]
};
function poolsFor(eq, style){
  const base = JSON.parse(JSON.stringify(POOLS[eq] || POOLS.gym));
  if(eq !== "gym") return base;
  Object.entries(GYM_STRENGTH_ADD).forEach(([k, list]) => { base[k] = [...list, ...(base[k] || []).filter(n => !list.includes(n))]; });
  base.steady = ["StairMaster Steady State","Bike Steady Ride","Treadmill Incline Walk"];
  base.interval = [...base.interval, "Treadmill Intervals"];
  const st = STYLES[style] ? style : "mix";
  if(st === "classic"){ base.power = ["Kettlebell Swing","Box Jump"]; base.interval = [...base.interval, "Rowing Intervals"]; return base; }
  Object.entries(FUNCTIONAL_POOLS).forEach(([k, list]) => {
    if(st === "functional") base[k] = k === "lunge" ? [...list, ...(base[k] || [])] : list.slice();
    else { const merged = []; const a = list, b = base[k] || []; for(let i = 0; i < Math.max(a.length, b.length); i++){ if(a[i]) merged.push(a[i]); if(b[i]) merged.push(b[i]); } base[k] = [...new Set(merged)]; }
  });
  return base;
}

/* ---------- safety rules for the new moves ---------- */
const AVOID_ADD = {
  knees:["Box Jump","Burpee Broad Jump","Wall Balls","Sandbag Lunges","Jump Rope Intervals","Thruster","Back Squat","Hyrox Station Circuit"],
  lowerBack:["Power Clean","Barbell Row","Back Squat","Trap Bar Deadlift","Barbell Romanian Deadlift","Sandbag Lunges","Sled Pull","Hyrox Station Circuit"],
  shoulders:["Overhead Press","Thruster","Wall Balls","Pull-up","SkiErg Intervals","Battle Ropes"],
  hips:["Box Jump","Burpee Broad Jump","Sandbag Lunges","Back Squat"],
  wrists:["Power Clean","Thruster","Burpee Broad Jump"],
  elbows:["Pull-up","Battle Ropes"],
  neck:["Overhead Press","Sandbag Lunges"],
  ankles:["Box Jump","Jump Rope Intervals","Burpee Broad Jump","Hyrox Station Circuit"]
};
Object.entries(AVOID_ADD).forEach(([k, list]) => { AVOID_BY_AREA[k] = [...(AVOID_BY_AREA[k] || []), ...list]; });
Object.assign(AGE_SWAPS["50-59"], {"Box Jump":"Kettlebell Swing", "Burpee Broad Jump":"Rowing Intervals", "Jump Rope Intervals":"Bike Intervals"});
Object.assign(AGE_SWAPS["60+"], {"Box Jump":"Leg Press", "Burpee Broad Jump":"Rowing Intervals", "Jump Rope Intervals":"Bike Intervals", "Power Clean":"Kettlebell Deadlift",
  "Thruster":"Dumbbell Shoulder Press", "Back Squat":"Leg Press", "Pull-up":"Lat Pulldown", "Battle Ropes":"Bike Intervals", "Hyrox Station Circuit":"Rowing Intervals"});
Object.assign(EXPERIENCE_SWAPS.new, {"Power Clean":"Kettlebell Swing", "Pull-up":"Lat Pulldown", "Barbell Row":"Chest-Supported Row", "Overhead Press":"Dumbbell Shoulder Press",
  "Thruster":"Dumbbell Shoulder Press", "Back Squat":"Leg Press", "Hyrox Station Circuit":"Rowing Intervals"});
Object.assign(SAFE_BY_KEY, {power:[...SAFE_BY_KEY.power, "Rowing Intervals"], interval:[...SAFE_BY_KEY.interval, "Rowing Intervals"]});
Object.assign(LOAD_GUIDE, {"Back Squat":[0.7,"bb","lower"], "Trap Bar Deadlift":[0.95,"bb","lower"], "Barbell Romanian Deadlift":[0.6,"bb","lower"],
  "Barbell Row":[0.5,"bb","upper"], "Overhead Press":[0.35,"bb","upper"], "Power Clean":[0.45,"bb","lower"], "Thruster":[0.3,"bb","lower"],
  "Wall Balls":[0.08,"ball","upper"], "Sandbag Lunges":[0.2,"bag","lower"]});
Object.assign(LOAD_STEP, {ball:3, bag:5}); Object.assign(LOAD_MIN, {ball:4, bag:10});
const REP_CAPS_ADD = {"Back Squat":"10", "Trap Bar Deadlift":"10", "Power Clean":"5", "Pull-up":"5–12", "Box Jump":"5–8", "Thruster":"12", "Overhead Press":"10"};

/* ---------- v5.2: cycling + treadmill ---------- */
const CARDIO_MACHINES = [
E("Bike Steady Ride","Conditioning",1,"25–30 min",0,"Smooth, steady pedalling at a pace you could talk through.","",["Saddle at hip height, slight knee bend at the bottom","Cadence around 80–90 rpm","Steady effort — breathing harder but able to talk"],["Saddle too low","Bouncing on the seat at high cadence"],["StairMaster Steady State","Treadmill Incline Walk"]),
E("Treadmill Intervals","Conditioning",8,"1 min hard / 1 min easy",0,"Run or power-walk uphill hard, then walk easy to recover.","",["Hard: fast run or steep power walk","Easy: flat walk, let the breathing settle","Stay tall, don't hold the rails"],["Holding the handrails","Starting so fast you can't finish the rounds"],["Bike Intervals","StairMaster Intervals"]),
E("Treadmill Incline Walk","Conditioning",1,"25–30 min",0,"Brisk walk on an incline, tall posture, hands off the rails.","",["Incline 6–12%, speed 4.5–6 km/h","Tall posture, arms swinging","Hands off the rails"],["Leaning on the handrails","Incline so steep you hunch forward"],["Bike Steady Ride","StairMaster Steady State"])
];
EXTRA.push(...CARDIO_MACHINES);
Object.assign(FAMILY, {"Bike Steady Ride":"bike", "Treadmill Intervals":"treadRun", "Treadmill Incline Walk":"treadWalk"});
Object.assign(STEPS, {
  treadRun:[["Set up","Stand on the side rails, start the belt at a walk."],["Warm up","Walk 3–5 minutes, then set your hard speed or incline."],["Go hard","Run or power-walk hard for the work time, tall and relaxed."],["Recover","Drop to an easy walk and let the breathing settle."],["Repeat","Repeat the rounds, then cool down with an easy walk."]],
  treadWalk:[["Set up","Start at an easy walk on a flat belt."],["Add incline","Raise the incline to 6–12% and speed to 4.5–6 km/h."],["Stand tall","Tall posture, arms swinging, hands off the rails."],["Hold the pace","Breathing harder but able to talk for the whole block."],["Cool down","Lower the incline and walk easy for 2–3 minutes."]]
});
Object.assign(FEEL_EXTRA, {treadRun:"Legs and lungs working hard in the hard phase, recovering in the easy phase.", treadWalk:"Glutes, calves and a steady raised heart rate."});
Object.assign(DE.names, {"Bike Steady Ride":"Radfahren gleichmäßig", "Treadmill Intervals":"Laufband-Intervalle", "Treadmill Incline Walk":"Laufband Steigungsgehen"});
Object.assign(DE.ex, {
  "Bike Steady Ride":["Ruhig und gleichmäßig treten, in einem Tempo, bei dem du noch sprechen kannst.",["Sattel auf Hüfthöhe, Knie unten leicht gebeugt","Trittfrequenz etwa 80–90 U/min","Gleichmäßige Anstrengung – schneller atmen, aber sprechen können"],["Sattel zu niedrig","Bei hoher Frequenz auf dem Sattel hüpfen"]],
  "Treadmill Intervals":["Hart bergauf laufen oder zügig gehen, dann locker gehen zum Erholen.",["Hart: schnell laufen oder steil zügig gehen","Locker: flach gehen, Atmung beruhigen","Aufrecht bleiben, nicht festhalten"],["An den Griffen festhalten","So schnell starten, dass du die Runden nicht schaffst"]],
  "Treadmill Incline Walk":["Zügig mit Steigung gehen, aufrecht, Hände weg von den Griffen.",["Steigung 6–12 %, Tempo 4,5–6 km/h","Aufrechte Haltung, Arme schwingen","Hände weg von den Griffen"],["Auf die Griffe stützen","So steil, dass du dich nach vorne krümmst"]]
});
Object.assign(DE.steps, {
  treadRun:[["Einstellen","Auf die Seitenränder stellen, Band im Gehtempo starten."],["Aufwärmen","3–5 Minuten gehen, dann hartes Tempo oder Steigung einstellen."],["Hart","In der Arbeitsphase hart laufen oder zügig gehen, aufrecht und locker."],["Erholen","Auf lockeres Gehen reduzieren und die Atmung beruhigen."],["Wiederholen","Runden wiederholen, dann locker auslaufen."]],
  treadWalk:[["Einstellen","Mit lockerem Gehen auf flachem Band starten."],["Steigung","Steigung auf 6–12 % und Tempo auf 4,5–6 km/h erhöhen."],["Aufrecht","Aufrechte Haltung, Arme schwingen, Hände weg von den Griffen."],["Tempo halten","Schneller atmen, aber den ganzen Block sprechen können."],["Auslaufen","Steigung senken und 2–3 Minuten locker gehen."]]
});
Object.assign(DE.feel, {treadRun:"Beine und Lunge arbeiten hart in der harten Phase und erholen sich in der lockeren.", treadWalk:"Gesäß, Waden und ein gleichmäßig erhöhter Puls."});
Object.assign(VIDEO_SEARCH, {"Bike Steady Ride":"stationary bike setup and technique", "Treadmill Intervals":"treadmill interval running technique", "Treadmill Incline Walk":"incline treadmill walking proper form"});
if(typeof VIDEOS !== "undefined" && VIDEOS["Bike Intervals"]) VIDEOS["Bike Steady Ride"] = VIDEOS["Bike Intervals"];
AVOID_BY_AREA.knees.push("Treadmill Intervals"); AVOID_BY_AREA.ankles.push("Treadmill Intervals");
AGE_SWAPS["60+"]["Treadmill Intervals"] = "Treadmill Incline Walk";
SAFE_BY_KEY.steady = ["Bike Steady Ride", ...SAFE_BY_KEY.steady];
