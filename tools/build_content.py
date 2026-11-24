"""Authoring source for original question packs. Run: python3 tools/build_content.py
Every item is original wording, hand-checked, and re-validated by __tests__/content.test.ts."""
import json, os
P = {}
P['knowledge'] = [
 ("Which planet is closest to the Sun?","Mercury",["Venus","Earth","Mars"],"Mercury has the smallest orbit of all the planets.",1),
 ("How many continents are there in the common seven-continent model?","7",["5","6","8"],"The seven are Africa, Antarctica, Asia, Australia/Oceania, Europe, North America and South America.",1),
 ("What is the chemical symbol for gold?","Au",["Ag","Gd","Go"],"Au comes from the Latin word aurum.",1),
 ("Which is the largest ocean on Earth?","Pacific Ocean",["Atlantic Ocean","Indian Ocean","Arctic Ocean"],"The Pacific covers about a third of the planet's surface.",1),
 ("Which is the largest mammal alive today?","Blue whale",["African elephant","Giraffe","Hippopotamus"],"Blue whales are the largest animals known to have ever lived.",1),
 ("How many sides does a hexagon have?","6",["5","7","8"],"Hexa- means six.",1),
 ("Which gas do plants take in from the air for photosynthesis?","Carbon dioxide",["Oxygen","Nitrogen","Helium"],"Plants use carbon dioxide, water and light to make sugars and release oxygen.",1),
 ("In which country is the city of Kyoto?","Japan",["China","South Korea","Thailand"],"Kyoto was Japan's imperial capital for over a thousand years.",1),
 ("What is the capital city of Canada?","Ottawa",["Toronto","Vancouver","Montreal"],"Ottawa is the capital, even though Toronto is larger.",2),
 ("Who wrote the play Romeo and Juliet?","William Shakespeare",["Charles Dickens","Jane Austen","Mark Twain"],"Shakespeare wrote it in the 1590s.",1),
 ("What is the hardest naturally occurring substance?","Diamond",["Gold","Iron","Quartz"],"Diamond rates 10 on the Mohs hardness scale.",1),
 ("Which organ pumps blood around the human body?","Heart",["Liver","Lungs","Kidney"],"The heart pushes blood through arteries and veins.",1),
 ("At what temperature in degrees Celsius does water boil at sea level?","100",["90","110","120"],"Pure water boils at 100 °C at standard sea-level pressure.",1),
 ("On which continent is the Sahara Desert?","Africa",["Asia","Australia","South America"],"The Sahara spans much of northern Africa.",1),
 ("How many players from one team are on the field in a standard football (soccer) match?","11",["9","10","12"],"Each team fields eleven players including the goalkeeper.",1),
 ("What is the smallest prime number?","2",["0","1","3"],"A prime has exactly two divisors. 2 is the first and the only even prime.",2),
 ("Which planet is known as the Red Planet?","Mars",["Venus","Jupiter","Saturn"],"Iron oxide dust gives Mars its reddish colour.",1),
 ("Which river is the longest in Africa?","Nile",["Congo","Niger","Zambezi"],"The Nile is about 6,650 km long.",2),
 ("In which year did humans first land on the Moon?","1969",["1959","1965","1975"],"Apollo 11 landed on 20 July 1969.",2),
 ("Which language has the most native speakers in the world?","Mandarin Chinese",["English","Spanish","Hindi"],"Mandarin has more native speakers than any other language.",3),
 ("What is the main language spoken in Brazil?","Portuguese",["Spanish","French","English"],"Brazil was a Portuguese colony.",1),
 ("Which scientist is best known for the theory of general relativity?","Albert Einstein",["Isaac Newton","Niels Bohr","Galileo Galilei"],"Einstein published general relativity in 1915.",2),
 ("About how many bones does a typical adult human have?","206",["106","306","406"],"Babies have more, but many fuse as we grow.",3),
 ("What is the capital city of Australia?","Canberra",["Sydney","Melbourne","Perth"],"Canberra was purpose-built as the capital.",3),
 ("Which mountain is the highest above sea level?","Mount Everest",["K2","Kangchenjunga","Denali"],"Everest rises about 8,849 m above sea level.",1),
]
P['word'] = [
 ("Which word is closest in meaning to \"abundant\"?","Plentiful",["Scarce","Tiny","Hidden"],"Abundant means existing in large quantities.",1),
 ("What does \"reluctant\" mean?","Unwilling",["Eager","Certain","Rapid"],"A reluctant person hesitates to do something.",2),
 ("What does \"meticulous\" mean?","Very careful about details",["Careless","Loud","Lazy"],"A meticulous worker checks every detail.",3),
 ("What does \"ephemeral\" mean?","Lasting a very short time",["Lasting forever","Heavy","Brightly coloured"],"Ephemeral things disappear quickly, like morning mist.",3),
 ("Which word is the opposite of \"ancient\"?","Modern",["Old","Historic","Aged"],"Ancient means very old; modern means recent.",1),
 ("What does \"candid\" mean?","Honest and direct",["Secretive","Sweet","Angry"],"A candid answer is open and frank.",2),
 ("What does \"benevolent\" mean?","Kind and generous",["Cruel","Confused","Wealthy"],"Benevolent people wish others well.",3),
 ("What does \"frugal\" mean?","Careful with money",["Wasteful","Generous","Hungry"],"Frugal people avoid unnecessary spending.",2),
 ("What does \"ambiguous\" mean?","Open to more than one meaning",["Perfectly clear","Simple","Rude"],"An ambiguous sentence can be read in different ways.",3),
 ("What does \"resilient\" mean?","Able to recover quickly from difficulty",["Easily broken","Noisy","Slow"],"Resilient people bounce back.",3),
 ("Which is the correct spelling of the word meaning \"to get something given to you\"?","Receive",["Recieve","Receeve","Recive"],"Remember: i before e, except after c.",2),
 ("Which is the correct spelling of the word meaning \"without any doubt\"?","Definitely",["Definately","Definitly","Definetely"],"The word contains the stem finite.",3),
 ("What does \"verbose\" mean?","Using more words than needed",["Silent","Brief","Cheerful"],"A verbose speech could be much shorter.",3),
 ("What does \"pragmatic\" mean?","Dealing with things in a practical way",["Dreamy","Fearful","Playful"],"A pragmatic choice focuses on what works.",4),
 ("What does \"lucid\" mean?","Clear and easy to understand",["Dark","Confusing","Sleepy"],"A lucid explanation is easy to follow.",3),
 ("Which word means \"to make something better\"?","Improve",["Worsen","Ignore","Delay"],"To improve is to raise the quality of something.",1),
]
P['logic'] = [
 ("All roses are flowers, and all flowers need water. Which statement must be true?","All roses need water",["All flowers are roses","Some roses need no water","Nothing can be concluded"],"Roses are flowers, and every flower needs water, so every rose does too.",2),
 ("If it rains, the street gets wet. The street is wet. What can you conclude?","It may or may not have rained",["It definitely rained","It definitely did not rain","The street is always wet"],"A street can get wet for other reasons, such as a hose or a street cleaner.",3),
 ("Tom is taller than Sam, and Sam is taller than Lee. Who is the shortest?","Lee",["Sam","Tom","Cannot be told"],"Order from tallest: Tom, Sam, Lee.",1),
 ("Anna is older than Ben, Ben is older than Cara, and Cara is older than Dan. Who is second oldest?","Ben",["Anna","Cara","Dan"],"Order from oldest: Anna, Ben, Cara, Dan.",2),
 ("A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?","5 cents",["10 cents","15 cents","1 cent"],"If the ball is 5 cents, the bat is $1.05, and together they cost $1.10.",3),
 ("Which number does not belong with 3, 5, 11 and 9?","9",["3","5","11"],"3, 5 and 11 are prime numbers. 9 is divisible by 3.",2),
 ("Five machines make five items in five minutes. How long do 100 machines need to make 100 items?","5 minutes",["100 minutes","20 minutes","1 minute"],"Each machine makes one item in five minutes, so 100 machines make 100 items in five minutes.",3),
 ("All Bloops are Razzies, and all Razzies are Lazzies. Therefore all Bloops are...","Lazzies",["Not Lazzies","Only some Lazzies","Neither Razzies nor Lazzies"],"Chain the statements: Bloops are Razzies, which are Lazzies.",1),
 ("Which shape is the odd one out: triangle, square, circle, pentagon?","Circle",["Triangle","Square","Pentagon"],"The circle is the only shape with no straight sides.",2),
 ("A farmer has 17 sheep. All but 9 run away. How many are left?","9",["8","17","0"],"\"All but 9\" means 9 stay behind.",2),
]
P['critical'] = [
 ("A study of 12 people finds that a supplement helps. What is the main weakness?","The sample is too small to generalise",["The supplement is too cheap","The people were all adults","The study was published"],"Small samples can give results that happen by chance.",2),
 ("Ice cream sales and drowning incidents both rise in summer. What is the best conclusion?","Warm weather likely affects both",["Ice cream causes drowning","Drowning causes ice cream sales","They are unrelated in every way"],"A third factor, hot weather, explains both. Correlation is not causation.",2),
 ("\"Ignore his plan; he never went to university.\" What kind of argument is this?","Ad hominem",["Bandwagon","Slippery slope","Appeal to evidence"],"It attacks the person instead of the plan itself.",3),
 ("\"Everyone is buying it, so it must be good.\" This is a...","Bandwagon appeal",["Straw man","Circular argument","Fair comparison"],"Popularity alone does not show quality.",3),
 ("Which source is generally the most reliable for checking a scientific claim?","A peer-reviewed journal article",["An anonymous forum post","A social media meme","An advertisement"],"Peer review means other experts have checked the methods.",1),
 ("\"Either you back this plan or you hate progress.\" This is an example of a...","False dilemma",["Fair question","Proven fact","Balanced view"],"It offers only two choices when many exist.",3),
 ("Someone makes a surprising claim without evidence. What is the best first response?","Ask what evidence supports it",["Accept it immediately","Reject it angrily","Repeat it to others"],"Claims should be supported before they are accepted.",1),
 ("Which statement is an opinion rather than a fact?","Winter is the most pleasant season",["Water freezes at 0 °C","The Earth orbits the Sun","Paris is in France"],"Opinions express a preference and cannot be proven true or false.",1),
 ("Two things happen together often. What does this alone tell you about cause?","It is not enough to prove one causes the other",["One must cause the other","Both are random","They are the same thing"],"You need more evidence, such as controlled experiments, to show cause.",3),
 ("Which headline is the most neutral?","Council approves new budget",["Council slams through reckless budget","Council's shocking budget betrays voters","Council gambles away your money"],"Neutral wording describes what happened without loaded words.",2),
]
P['problem'] = [
 ("A train leaves at 2:15 pm and the trip takes 2 hours 50 minutes. When does it arrive?","5:05 pm",["5:15 pm","4:55 pm","5:25 pm"],"2:15 plus 2 h is 4:15, plus 50 min is 5:05.",1),
 ("You read 12 pages a day. How many days do you need to finish a 150-page book?","13 days",["12 days","14 days","15 days"],"150 ÷ 12 = 12.5, so you need 13 days.",2),
 ("A recipe for 4 people uses 300 g of flour. How much flour is needed for 6 people?","450 g",["400 g","500 g","600 g"],"300 ÷ 4 = 75 g each, and 75 × 6 = 450 g.",2),
 ("Which is the cheapest per item?","4 for $5.20",["6 for $9.00","10 for $14.00","12 for $19.20"],"Per item: $1.50, $1.40, $1.30 and $1.60. The cheapest is $1.30.",3),
 ("You have 8 coins and one is slightly heavier. Using a balance scale, what is the fewest weighings that always finds it?","2",["1","3","4"],"Weigh 3 against 3. If equal, weigh 1 against 1 of the remaining 2. Otherwise weigh two of the heavier three.",4),
 ("Maya is 4 years older than Leo. In 6 years their ages add up to 40. How old is Leo now?","12",["10","14","16"],"Leo is L and Maya is L+4. (L+6)+(L+10)=40, so L=12.",3),
 ("A rectangle has a perimeter of 30 and a length of 9. What is its area?","54",["45","60","81"],"Half the perimeter is 15, so the width is 6 and the area is 9 × 6 = 54.",2),
 ("You walk 3 km north then 4 km east. How far are you from the start in a straight line?","5 km",["7 km","1 km","12 km"],"A 3-4-5 right triangle gives a distance of 5 km.",2),
 ("3 people paint a house in 6 days. At the same rate, how many days do 9 people need?","2 days",["3 days","4 days","18 days"],"The job is 18 person-days. 18 ÷ 9 = 2.",2),
 ("What is the angle between the clock hands at exactly 3:00?","90°",["60°","120°","180°"],"Each hour mark is 30°, and 3 hours apart is 90°.",1),
]
os.makedirs('content/packs', exist_ok=True)
for cat, rows in P.items():
    out = []
    for i, (q, c, w, e, d) in enumerate(rows):
        opts = list(w); idx = i % 4; opts.insert(idx, c)
        out.append({"id": f"{cat[:3]}-{i+1:03d}", "category": cat, "prompt": q, "options": opts, "answerIndex": idx, "explanation": e, "difficulty": d, "source": "original"})
    json.dump({"version": 1, "category": cat, "license": "Original content, owned by the BrainRush AI project", "questions": out}, open(f'content/packs/{cat}.json', 'w'), indent=1, ensure_ascii=False)
print({k: len(v) for k, v in P.items()})
