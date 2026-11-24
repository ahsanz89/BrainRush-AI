"""Renders real app screens (web build in headless Chrome) into Play Store screenshots, 1080x1920.
Usage: npx expo export --platform web --output-dir /tmp/webexp && python3 tools/make_screenshots.py
The sample profile below is DEMO DATA used only to make screenshots look lived-in."""
import json, re, subprocess, time, sys
from playwright.sync_api import sync_playwright
OUT='store/screenshots'; URL='http://localhost:8765/'
today=time.strftime('%Y-%m-%d')
def day(n): return time.strftime('%Y-%m-%d', time.localtime(time.time()-86400*n))
prof={"version":1,"name":"Alex","onboarded":True,"interests":["logic","memory","math"],"dailyGoal":3,"difficulty":"medium","theme":"dark","haptics":True,
 "reminders":{"enabled":False,"hour":19,"minute":0},"xp":640,"streak":{"current":6,"best":9,"lastDay":today},
 "xpByDay":{day(6):40,day(5):90,day(4):0,day(3):120,day(2):85,day(1):150,today:60},"sessionsByDay":{today:1},"dailyDone":{},
 "categoryStats":{"logic":{"played":6,"correct":24,"total":30},"memory":{"played":4,"correct":9,"total":20},"math":{"played":8,"correct":33,"total":40},"word":{"played":3,"correct":11,"total":15},"knowledge":{"played":3,"correct":10,"total":15},"visual":{"played":2,"correct":6,"total":10}},
 "history":[{"date":today,"category":"math","mode":"quick","total":5,"correct":5,"xp":60,"percent":100},{"date":day(1),"category":"daily","mode":"daily","total":8,"correct":6,"xp":95,"percent":75},{"date":day(1),"category":"logic","mode":"timed","total":10,"correct":8,"xp":55,"percent":80},{"date":day(2),"category":"memory","mode":"quick","total":5,"correct":3,"xp":35,"percent":60}],
 "achievements":["first_session","streak_3","perfect","xp_500"],"counters":{"sessions":23,"perfect":2,"noHint":14,"dailies":3,"timedGood":1}}
srv=subprocess.Popen([sys.executable,'-m','http.server','8765','-d','/tmp/webexp'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1.5)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    def ctx(profile,scheme='dark'):
        c=b.new_context(viewport={'width':360,'height':640},device_scale_factor=3,color_scheme=scheme,is_mobile=True,has_touch=True)
        if profile is not None: c.add_init_script("localStorage.setItem('brainrush.profile.v1', %s)"%json.dumps(json.dumps(profile)))
        return c
    def shot(pg,name): pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/{name}.png'); print(name)
    # onboarding (fresh)
    c=ctx(None); pg=c.new_page(); pg.goto(URL); pg.wait_for_selector('text=Get started >> visible=true'); shot(pg,'01-onboarding'); c.close()
    # main flow
    c=ctx(prof); pg=c.new_page(); pg.goto(URL); pg.wait_for_selector('text=Daily Challenge >> visible=true'); shot(pg,'02-home')
    pg.get_by_role('tab',name=re.compile('Train')).click(); pg.wait_for_selector('text=Mixed Brain Workout >> visible=true'); shot(pg,'03-train')
    pg.get_by_role('button',name=re.compile('^Mathematics')).click(); pg.wait_for_selector('text=How it works >> visible=true'); shot(pg,'04-category')
    pg.get_by_role('button',name=re.compile('Quick challenge')).click(); pg.wait_for_selector('text=Solve >> visible=true'); shot(pg,'05-gameplay')
    for i in range(5):
        expr=pg.locator('[aria-label]').evaluate_all("els=>els.map(e=>e.getAttribute('aria-label')).filter(t=>/^[0-9 +×÷−]+$/.test(t))")[-1]
        ans=int(eval(expr.replace('×','*').replace('÷','//').replace('−','-')))
        pg.wait_for_timeout(1200)
        pg.get_by_role('button',name=re.compile(r': %d$'%ans)).click(); pg.wait_for_selector('text=/Next|See results/ >> visible=true')
        if i==0: shot(pg,'06-feedback')
        pg.get_by_role('button',name=re.compile('^(Next|See results)$')).click(); pg.wait_for_timeout(300)
    pg.wait_for_selector('text=Review >> visible=true'); shot(pg,'07-results')
    pg.get_by_role('button',name='Back to home').click(); pg.wait_for_selector('text=Daily Challenge >> visible=true')
    pg.get_by_role('tab',name=re.compile('Progress')).click(); pg.wait_for_selector('text=XP this week >> visible=true'); shot(pg,'08-progress')
    pg.get_by_role('tab',name=re.compile('Profile')).click(); pg.get_by_role('button',name='Achievements',exact=True).click(); pg.wait_for_selector('text=First Spark >> visible=true'); shot(pg,'09-achievements'); c.close()
    # memory game
    c=ctx(prof); pg=c.new_page(); pg.goto(URL); pg.wait_for_selector('text=Daily Challenge >> visible=true')
    pg.get_by_role('tab',name=re.compile('Train')).click(); pg.get_by_role('button',name=re.compile('^Memory')).click()
    pg.get_by_role('button',name=re.compile('Quick challenge')).click(); pg.wait_for_selector('text=/Your turn/ >> visible=true',timeout=15000); shot(pg,'10-memory'); c.close()
    # light theme home
    lp=dict(prof,theme='light'); c=ctx(lp,'light'); pg=c.new_page(); pg.goto(URL); pg.wait_for_selector('text=Daily Challenge >> visible=true'); shot(pg,'11-home-light'); c.close()
    b.close()
finally: srv.terminate()
