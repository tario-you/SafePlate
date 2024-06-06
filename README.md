# checklist

frontend

- [x] ui compatibility
- [x] translations
- [x] fix poor contrast issues
- [x] white screen

backend

- [x] 百度千帆大模型

  - [x] 模型两种用处, prompt 我们设计 (含 active 的个人信息)

    - [x] 1 basic chat
    - [x] 2 条形码 -> 接口 https://www.tanshuapi.com/market/detail-77 -> 食品名称 -> USDA 数据库查询 https://fdc.nal.usda.gov/api-guide.html (https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFoodsList) -> 找到最接近的 n 结果 -> 让用户选择 -> 取出营养信息 -> 加到 ai 的 prompt
    - [ ] 3 images: aws (awaiting name server propagation less tha 48 hrs) (vultr rate limited)
      - [ ] food and health information (straight away)
      - [ ] more information >

  - [x] store + recover past chat conversations

- [x] password (sms verification doesnt really work)
- [x] 存储个人信息
- [x] likes
- [x] yada's interface
- [x] live update articles

urgent:

- [ ] health information fill in form not disappearing after filling in
- [x] new prompts
- [ ] remove usda, remove 3 user choices, just let chat gpt do it straight away
  - [ ] the top 3 things (just do some regex for the 1. **yap** ... 2. **yap** ... 3. **yap**)

```
Based on the provided nutrient makeup information for PEANUTS and the user's health profile, here is the analysis for Mary:

**Allergen: Peanut**

* Peanut is listed as a potential allergen in the food profile.
* Mary has no reported allergy to peanuts, so there is no immediate allergen alert.
* However, it's always advisable to be cautious when consuming allergens, especially if not consumed regularly.

**Consumption: Excessive**

* No specific calorie information is provided for the peanuts.
* Based on Mary's BMI (calculated using weight and height), which falls under the healthy range, a general recommendation for calorie intake can be made.
* Peanuts are high in fat and energy, so excessive consumption could lead to increased calorie intake.
* Mary should monitor her portion sizes to ensure she doesn't exceed her recommended daily calorie intake.

**Health: Gluten Intolerance**

* Mary has reported gluten intolerance.
* Peanuts are naturally gluten-free, so they are safe for Mary to consume from a gluten intolerance perspective.
* However, Mary should always check labels for any added ingredients that may contain gluten.

No specific "Scientific" alerts apply to peanuts in general, as they are widely consumed and considered safe when eaten in moderation and without allergic reactions.

Based on the analysis, here are the three main health conditions in Category:Term format, along with detailed information:

1. **Allergen: Peanut**


	* **Component Present**: Peanuts contain proteins that can trigger allergic reactions in sensitized individuals.
	* **Danger**: Although Mary doesn't report a peanut allergy, unexpected reactions are possible, especially if she hasn't consumed peanuts recently.
	* **Precautionary Measures**: Consume peanuts in small amounts initially to observe any potential reactions. Have anti-allergy medication on hand in case of an emergency.
2. **Consumption: Calorie Intake**


	* **Component Present**: Peanuts are high in fat and energy.
	* **Danger**: Excessive consumption can lead to increased calorie intake, potentially causing weight gain if not balanced with physical activity.
	* **Precautionary Measures**: Portion control is key. Measure out servings and be mindful of total daily calorie intake.
3. **Health: Gluten Intolerance**


	* **Component Present**: Peanuts are gluten-free.
	* **Danger**: Although peanuts themselves are safe, cross-contamination with gluten-containing foods during processing or storage is possible.
	* **Precautionary Measures**: Check labels for gluten-free certification. Store peanuts separately from gluten-containing foods. Be vigilant when eating out to ensure gluten-free options are truly gluten-free.

These health conditions, along with their explanations and precautionary measures, should help Mary make informed decisions when consuming peanuts.
```

- [x] turn off comments
- [ ] passwords need to be hashed
- [ ] click a family member -> add family member -> fields r not cleared
- [x] family title is not translated
- [ ] add family member -> 'sex' is not translated
- [ ] need to pair chatbot with personal information

[ ] PUBLISHING

future:

- [ ] sharing
- [ ] comments
- [ ] more descriptive chat history names
- [ ] gpt
  - [ ] stream
  - [ ] finetuning / training with pdfs
  - [ ] local phone number logged in caching
- [ ] more scientific responses: use usda database / scientific stuff, not just llm output
- [ ] fix background for splash screen image
- [ ] add buffer / loading thingy
- [ ] do local async storage cache
- [ ] default, on the home screen, the info fill in field isnt shown
- [ ] forgot password

## troubleshooting: potential errors u might encounter

<b>Linker command failed with exit code 1 (use -v to see invocation)</b>

remove -ObjC from all .xcconfig files

at least got me to launch the phone

ok and then

run

```
xcodebuild -workspace Safeplate.xcworkspace -configuration Debug -scheme Safeplate -destination id=10F12D25-B930-42AB-BF97-A60A8638E813 -verbose > build.log
```

and check the duplicate files / links

e.g.

```
duplicate symbol
'_OBJC_IVAR_$_GCDAsyncSocket.delegate' in:
/Users/tarioyou/Library/Developer/Xcode/DerivedData/Safeplate-ghlihzpxatlvtqdmvypppkiltnpu/Build/Products/Debug-iphonesimulator/CocoaAsyncSocket/libCocoaAsyncSocket.a[x86_64][3](GCDAsyncSocket.o)
/Users/tarioyou/Library/Developer/Xcode/DerivedData/Safeplate-ghlihzpxatlvtqdmvypppkiltnpu/Build/Products/Debug-iphonesimulator/TcpSockets/libTcpSockets.a[x86_64][2](GCDAsyncSocket.o)
```

<a href="https://github.com/Rapsssito/react-native-tcp-socket/issues/61#issuecomment-653881488">https://github.com/Rapsssito/react-native-tcp-socket/issues/61#issuecomment-653881488</a>

-> RCTAppDelegate::bundleURL not implemented

<b>Command PhaseScriptExecution failed with a nonzero exit code</b>

check the logs by double clicking this error in xcode, mine was a permisisons denied problem, so i fixed with:

```
sudo chown -R $(whoami) /Users/tarioyou/Safeplate
sudo chmod -R 755 /Users/tarioyou/Safeplate
```

<b>
[!] Invalid `Podfile` file: uninitialized constant Pod::Podfile::FlipperConfiguration. #  from /Users/tarioyou/Safeplate/ios/Podfile:22
 #  -------------------------------------------
 #  # ```
 >  flipper_config = ENV['NO_FLIPPER'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled
 #  
 #  -------------------------------------------
 </b>

lmao i wasn't even using flipper and that line was messing up the podfile, just remove the line

<b>Unable to open base configuration reference file ...</b>

```
cd ios
sudo pod install --allow-root
```

<b>react native error: unknown command "start"</b>

```
sudo npm install -g npm-check-updates --force
ncu -u
sudo npm install --force
```

<b>roll back to previous push state (whatever's on github rn)</b>

```
git fetch origin
git rest --hard origin/main
git clean -fd
```

<b>viewproptypes will be removed from react native. migarte...</b>

https://stackoverflow.com/a/73166444/13246089

<b>main.jsbundle: No such file or directory</b>

```
react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios' --assets-dest='./ios'
```

<b>messed up node_modules</b>

```
rm -rf node_modules/
npm install
```

or on windows

```
rmdir node_modules /s /q
```

<b>messed up pods</b>

```
cd ios
pod deintegrate
sudo pod install --allow-root
```

<b>module install difficulties</b>

use `sudo npm i module --force` and `sudo pod install --allow-root`

<b>buffer doesnt exist</b>

add `import { Buffer } from "buffer";` to the top of that file
or
`var Buffer = require("buffer");`

<b>Failed to save 'file': Insufficient permissions. Select 'Retry as Sudo' to retry as superuser.</b>

`sudo chown -R username directory_name`

<b>clear npx cache</b>

good technique to follow, always run app with: `sudo npx react-native start --reset-cache`

<b>Project /Safeplate/ios/Safeplate.xcodeproj cannot be opened because it is missing its project.pbxproj file.</b>

`sudo chown -R username:staff ./*`

<b>os / fs / crypto / http / https / any core react native modules that should exist - could not be found</b>

replace the name with the corresponding name in `"react-native"` in `package.json`

tip: use cmd+shift+f to replace all in a specific problematic directory

also make sure to check for both single and double quotes, i.e. require('module') and require("module")

<b>xcode download simulator slow / insists on installing simulator even though you already have them</b>

just go download them here: https://developer.apple.com/download/all/

<b>Cannot copy the image because the disk is almost full</b>

https://forums.developer.apple.com/forums/thread/735408#:~:text=So%2C%20I%27ve%20figured,iOS%2017.0%20image.

<b>multiple commands produce ... rct18nstrings</b>
pods > targets > delete "React-Core-RCTI18nStrings"

<b>create virtual environment</b>

```
python -m venv venv_name
```

<b>activate venv</b>

```
source venv_name/bin/activate
```

## note: for people in China, some commands may or may not work.

1. if a listed terminal command doesn't work, try it with VPN on (connect to anywhere but China/HK/Taiwan) or off.
2. if it still doesn't work, let it run for at least 10 minutes to see if it actually doesn't work.
3. if it still doesn't work, search up the error message on Baidu and follow a tutorial on there
4. else, contact me @taroxxx

# 1. Pre-requisites

## Mac

1. homebrew

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

- add to path (nano into "~/.zshrc" or "~/.bashrc" depending on whicn one you are using, if you are not sure, do both)

```bash
nano ~/.zshrc # or ~/.bashrc
```

- go to the bottom, and add the following lines

```bash
export PATH="/opt/homebrew/sbin:$PATH"
export PATH="~/.local/bin:$PATH"
```

1.  <kbd>Ctrl</kbd> + <kbd>O</kbd>
2.  <kbd>Enter</kbd>
3.  <kbd>Ctrl</kbd> + <kbd>X</kbd>

4.  git, node, watchman

    ```bash
    brew install git
    brew install node
    brew install watchman
    ```

5.  <a href="https://apps.apple.com/us/app/xcode/id497799835?mt=12">install Xcode in app store</a>

6.  install pod modules + gem

    ```bash
    sudo gem install cocoapods
    ```

    change directory

    ```bash
    # for example, for me:
    cd /Users/tarioyou/SafePlate/ios
    ```

    bundle install + pods

    ```bash
    bundle install
    bundle exec pod install
    ```

    make sure pods are updated

    ```bash
    pod update
    ```

7.  command line tools

    ```bash
    xcode-select --install
    ```

8.  java development kit

    ```bash
    brew tap homebrew/cask-versions
    brew install --cask zulu17
    ```

9.  <a src="https://developer.android.com/studio/index.html">install android studio</a>

    1.  menu bar > "Tools"
    2.  "SDK Manager"
    3.  "Languages & Frameworks" > "Android SDK" > "SDK Platforms" (see attached img)
    4.  tick "Show Package Details"
    5.  expand "Android 14.0 ("UpsideDownCake")"
    6.  tick "Android SDK Platform 34"
    7.  tick "Google APIs ARM 64 v8a System Image" (m1/m2 macs) or "Google APIs Intel x86_64 Atom System Image" (intel macs)
    8.  leave anything else ticked as ticked
    9.  click "Apply"
    10. wait for it to finish downloading
    11. click "Finish"
    12. click "OK"

    <img src="/assets/imgs/sdk_install.png" width="800">

- add to path (nano into "~/.zshrc" or "~/.bashrc" depending on whicn one you are using, if you are not sure, do both)

  ```bash
  nano ~/.zshrc # or ~/.bashrc
  ```

  - go to the bottom, and add the following lines

  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

  1.  <kbd>Ctrl</kbd> + <kbd>O</kbd>
  2.  <kbd>Enter</kbd>
  3.  <kbd>Ctrl</kbd> + <kbd>X</kbd>

7. install react-native

   ```bash
   npm i react-native
   ```

## Windows

1. <a src="https://reactnative.dev/docs/environment-setup?guide=native&platform=android&os=windows">follow these instructions</a>
2. install react-native

   ```bash
   npm i react-native
   ```

# 2. Getting Started

1. clone our repository

   ```bash
   git clone https://github.com/Lutashi/SafePlate
   ```

2. change directory to SafePlate

   ```bash
   # for example, for me:
   cd /Users/tarioyou/SafePlate
   ```

3. check if all dependencies are installed

   ```bash
   npx react-native doctor --verbose
   ```

   <i>make sure everything is green ticked, if not press <kbd>f</kbd> or <kbd>e</kbd> or search online for a solution or if finally nothing works, reach out to me in Discord @taroxxx</i>

   <img src="imgs/npx_doctor.png" width=800>

4. create a device + link emulator in Android Studio

   1. open "Device Manager"

      mac: "View" > "Tool Windows" > "Device Manager"

   2. in "Device Manager" > click "+"
   3. choose "Pixel Fold" > "next"
   4. choose "UpsideDownCakePrivacySandbox" > "Next"
   5. "Finish"
   6. start the device: click the play button
      <img src="/assets/imgs/device_play.png" width=800>
   7. go to terminal and link the device

      ```bash
      adb devices
      adb -s emulator-code-number reverse tcp:8081 tcp: 8081
      ```

      <img src="/assets/imgs/link_device.png" width=800>

5. start the app

   ```bash
   npx react-native start --verbose
   ```

   should see this:
   <img src="/assets/imgs/metro_menu.png" width=400>

   1. press <kbd>i</kbd> to run on ios -> you should see Simulator (mac app) pop up
      - <b>cannot run ios on windows ONLY MAC</b>
   2. press <kbd>a</kbd> to run on android -> you should see the emulator in AndroidStudio responding
      - works on both windows and mac

   takes around ~10-15 minutes for the first time, faster afterwards

# 3. Modifying the App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: With the emulator in Android Studio in focus, press the <kbd>R</kbd> key twice

   For **iOS**: With the Simulator in focus, hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

# 4. git Version Control

alright, the website github is set up. here are the instructions

you should've been invited to a repo to collaborate, if not:

1. reply to this message with your github email (set up an account if you haven't yet)
2. i will invite you to collaborate on this repo, you will receive an invite

now, onto setting up ssh verification on your machine, here are the steps for macos (if you are on another operating system, figure something out):

## ssh verification (macos)

1. type "git" in your terminal, if it's installed it will give you a bunch of instructions, if not a pop up will appear to install it (xcode select)

   ```bash
   git
   ```

2. go to directory
   ```bash
   cd /Users/yourusername/.ssh
   ```
3. generate key

   ```bash
   ssh-keygen -t rsa -C "githubemailaddress@mail.com"
   Generating public/private rsa key pair
   Enter file in which to save the key (...) [just press enter here]
   Enter passphrase (...) [enter your github password]
   Enter same passphrase again: [enter it again]
   Your identification has been saved in /Users/username/.ssh/id_rsa
   ...
   ```

4. copy the key
   ```bash
   cat id_rsa.pub | pbcopy
   ```
5. now your ssh key is in your clipboard, go to github.com > top right corner click on your profile > "settings" > on the left navigate to "ssh and gpg keys" > "new ssh key" > enter a title like "macbookair ssh key" > set the key type to "authentication key" > in the key field, paste in your clipboard > "add ssh key"
6. set up automatic passphrase
   ```bash
   eval `ssh-agent -s
   ```
7. you should see something like "Agent pid xxxx"

   ```bash
   ssh-add ~/.ssh/id_rsa
   enter passphrase for /Users/username/.ssh/id_rsa: [enter your github password]
   Identity added...
   ```

8. double check the automatic passphrase was set up

   ```bash
   ssh-add -l
   xxxx SHAxxx:xxxxxx githubemail@mail.com (RSA)
   ```

9. everything's set up and you can work with the git repo now

## working with the repo

1. open up the repository in a code editor (recommended: visual studio code https://code.visualstudio.com/download)

### pushing your local changes to the github repo

1. do whatever changes do the files
2. add files, add a commit message, and push!

```bash
git add filename1.txt filename2.html
git commit -m "updated landing page (enter an appropriate, informative commit message)"
git push -u origin main
```

### pulling from the github repo to update your local repo

```bash
git pull origin main
```

### resolve merge conflicts

if there is a merge conflict your terminal will say something like

```bash
CONFLICT (content): Merge conflict in filename.xxx
```

to resolve this:

(see picture)

1. pull
2. in your code editor, (on my end in visual studio code), you should see [see picture 2]
3. in visual studio code you see the "resolve in merge editor" [see picture 3]
4. this brings you to an interface to resolve the merge conflict [see picture 4]
5. then once you are done, press "complete merge" [see picture 5]
6. conflict resolved!

<img src="/assets/imgs/merge_conflicts.png" width=800>
````
