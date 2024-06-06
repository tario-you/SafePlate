en = {
    "language": "English",
    "HomeScreen": {
      "Log In": "Log In",
      "Log Out": "Log Out",
      "Sign Up": "Sign Up",
      "Hello": "Hello",
      "Welcome to": "Welcome to",
      "Scan": "Scan",
      "Scan descript": "Scan food items & barcodes",
      "Community": "Community",
      "Community descript": "Read blogs & articles on health",
      "Detection": "Detection",
      "Detection descript": "Connect biosensor & perform analysis",
      "Health": "Health",
      "Health descript": "Personalized healthcare chatbot assistant"
    },
    "Settings": {
      "title": "Settings",
      "privacy": "Privacy & Security",
      "language": "Language",
      "theme": "Theme",
      "family": "My Family",
      "notifications": "Notifications"
    },
    "Privacy": {
      "update": "Last Update",
      "credit": "Policy credit",
      "1": {
        "title": "Data protection principles",
        "1": "The Organisation is committed to processing data in accordance with its responsibilities under the DPA.",
        "2": "DPA requires that personal data shall be",
        "a": "processed lawfully, fairly and in a transparent manner in relation to individuals;",
        "b": "collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes; further processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes shall not be considered to be incompatible with the initial purposes;",
        "c": "adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed;",
        "d": "accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay;",
        "e": "kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed; personal data may be stored for longer periods insofar as the personal data will be processed solely for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes subject to implementation of the appropriate technical and organisational measures required by the DPA in order to safeguard the rights and freedoms of individuals; and",
        "f": "processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures."
      },
      "2": {
        "title": "General provisions",
        "a": "This policy applies to all personal data processed by the Organisation.",
        "b": "The Responsible Person shall take responsibility for the Organisation’s ongoing compliance with this policy.",
        "c": "This policy shall be reviewed at least annually.",
        "d": "The Organisation shall register with the Information Commissioner’s Office as an organisation that processes personal data."
      },
      "3": {
        "title": "Lawful, fair and transparent processing",
        "a": "To ensure its processing of data is lawful, fair and transparent, the Organisation shall maintain a Register of Systems.",
        "b": "The Register of Systems shall be reviewed at least annually.",
        "c": "Individuals have the right to access their personal data and any such requests made to the Organisation shall be dealt with in a timely manner."
      },
      "4": {
        "title": "Lawful purposes",
        "a": "All data processed by the Organisation must be done on one of the following lawful bases: consent, contract, legal obligation, vital interests, public task or legitimate interests (see ICO guidance for more information).",
        "b": "The Organisation shall note the appropriate lawful basis in the Register of Systems.",
        "c": "Where consent is relied upon as a lawful basis for processing data, evidence of opt-in consent shall be kept with the personal data.",
        "d": "Where communications are sent to individuals based on their consent, the option for the individual to revoke their consent should be clearly available and systems should be in place to ensure such revocation is reflected accurately in the Organisation’s systems."
      },
      "5": {
        "title": "Data minimisation",
        "a": "The Organisation shall ensure that personal data are adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."
      },
      "6": {
        "title": "Accuracy",
        "a": "The Organisation shall take reasonable steps to ensure personal data is accurate.",
        "b": "Where necessary for the lawful basis on which data  is processed, steps shall be put in place to ensure that personaldata is kept up to date."
      },
      "7": {
        "title": "Archiving / removal",
        "a": "To ensure that personal data is kept for no longer than necessary, the Organisation shall put in place an archiving policy for each area in which personal data is processed and review this process annually.",
        "b": "The archiving policy shall consider what data should/must be retained, for how long, and why."
      },
      "8": {
        "title": "Security",
        "a": "The Organisation shall ensure that personal data is stored securely using modern software that is kept-up-to-date.",
        "b": "Access to personal data shall be limited to personnel who need access and appropriate security should be in place to avoid unauthorised sharing of information.",
        "c": "When personal data is deleted this should be done safely such that the data is irrecoverable.",
        "d": "Appropriate back-up and disaster recovery solutions shall be in place."
      },
      "9": {
        "title": "Breach",
        "descript": "In the event of a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data, the Organisation shall promptly assess the risk to people’s rights and freedoms and if appropriate report this breach to the ICO (more information on the ICO website)."
      },
      "end": "END OF POLICY"
    },
    "Login": {
      "descript": "Only features this provides is syncing across devices + community updates",
      "email": "Email",
      "password": "Password",
      "continue": "Continue",
      "facebook": "Continue with Facebook",
      "google": "Continue with Google",
      "apple": "Continue with Apple",
      "phoneNumber": "Phone number"
    },
    "Verify": {
      "title": "Verify",
      "descript": "Check your email for a 6-digit verification code"
    },
    "UnderDevelopment": {
      "title": "Under Development",
      "comingsoon": "Coming Soon!",
      "descript1": "This feature is under development.",
      "descript2": "We're working hard to bring it to you soon!",
      "descript3": "Meanwhile, check out our Culinova Biosensor!"
    },
    "Community": {
      "title": "Community",
      "myposts": "My Posts",
      "recent": "Recent",
      "popular": "Popular",
      "blog": "Blogs",
      "event": "Events",
      "infographic": "Infographics",
      "article": "Articles",
      "make": "Make a Post"
    },
    "Health": {
      "previouschats": "Previous Chats",
      "title": "Chats",
      "questionprompt": "Enter a question"
    }
  }
  
def replace_with_nothing(d):
    if isinstance(d, dict):
        for key, value in d.items():
            d[key] = replace_with_nothing(value)
        return d
    else:
        return "nothing"

nothing = replace_with_nothing(en)

import json 

with open('localization/translations/nothing.json','w') as f:
    json.dump(nothing, f)
