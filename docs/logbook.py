import os

usernames = (
    'anthonyharriel','yamilette-alemany','Kaariinaa08','kevgom018','1uismar33r0','kian-robert',
    'jankii03','jahsyelrojas','angelvillegas1','leanelys','nicolasrivera25','FabiolaZTorres',
    'JorgeDeLeonOrama','devlin-hahn04','GabyMarr','Alma-pineiro','Lorenzo-PT','KennethSepu1',
    'Jachikasielu','JoshDG03','JuanIranzo','Ojani','andreasegarra','J3SSY-ANDU','daniellameleroo'
)

logbooktxtFilepath = os.path.join(os.path.dirname(__file__), 'logbook.txt')
logbookadocFilepath = os.path.join(os.path.dirname(__file__), os.path.join('sections', 'logbook.adoc'))

def updateLogbookAdoc(logbooktxt):
    entries = logbooktxt.split('\n')

    # format: { <user>: sections: { sections: <section>: [<issue>, <issue>, ...] } }
    users = {}

    for entry in entries:
        if entry.strip() == '':
            continue

        # expects: "entry #N: <user> modified section <section> on issue #<issue>"
        _, _, username, _, _, section, _, _, issue = entry.split(' ')
        issue = issue[1:]  # strip leading '#'

        if username not in users:
            users[username] = {'sections': {}}

        user = users[username]

        if section not in user['sections']:
            user['sections'][section] = []

        if issue not in user['sections'][section]:
            user['sections'][section].append(issue)

    # adding user entries in alphabetical order to logbook
    resultString = (
        "=== Logbook\n\n"
        "[%header]\n"
        "|===\n"
        "| Person |  Sections worked on\n"
    )

    for username in sorted(users.keys()):
        formattedSections = []
        for section in sorted(users[username]['sections'].keys()):
            formattedIssues = []
            for issue in sorted(users[username]['sections'][section]):
                formattedIssues.append(
                    f"link:https://github.com/uprm-inso4116-2025-2026-s1/semester-project-uprm-hand_me_down_clothing/issues/{issue}[#{issue}]"
                )
            formattedSections.append(f"{section} ({', '.join(formattedIssues)})")

        resultString += f"| link:https://github.com/{username}[{username}] | " + ', '.join(formattedSections) + '\n'

    resultString += '|==='

    # writing to logbook
    with open(logbookadocFilepath, 'w') as file:
        file.write(resultString)


def appendToLogbookTxt(user, section, issue):
    with open(logbooktxtFilepath, 'r+') as file:
        txt = file.read()
        isFirstEntry = txt.find('#') == -1

        if isFirstEntry:
            entryNum = 0
        else:
            lastEntryNum = txt[txt.find('#')+1:txt.find(':')]
            entryNum = int(lastEntryNum) + 1

        newEntry = f'entry #{entryNum}: {user} modified section {section} on issue #{issue}'
        newTxt = newEntry + '\n' + txt

        # fix duplicate check
        if newEntry in txt:
            print("This entry already exists in the logbook.")
        else:
            file.seek(0)
            file.write(newTxt)
            # ensure file is truncated in case new content is shorter (paranoia)
            file.truncate()

            updateLogbookAdoc(newTxt)

            print("\nAdded the following entry to the logbook:\n" + newEntry)


def removeFromLogbookTxt(entryNumber):
    with open(logbooktxtFilepath, 'r') as file:
        txt = file.read()

    entryIndex = txt.find(f'entry #{entryNumber}:')
    if entryIndex == -1:
        print(f"Entry #{entryNumber} does not exist.")
        return

    endIndex = txt.find('\n', entryIndex)
    if endIndex == -1:
        endIndex = len(txt)

    removed = txt[entryIndex:endIndex]
    newTxt = txt[:entryIndex] + txt[endIndex+1:]

    with open(logbooktxtFilepath, 'w') as file:
        file.write(newTxt)

    updateLogbookAdoc(newTxt)

    print("\nRemoved the following entry from the logbook:\n" + removed)


def choose_user():
    print("\nSelect user:")
    for i, uname in enumerate(usernames):
        print(f"{i}: {uname}")

    while True:
        user_idx = input("\nWhich user (enter number)? ").strip()
        if not user_idx.isnumeric():
            continue
        user_idx = int(user_idx)
        if 0 <= user_idx < len(usernames):
            return usernames[user_idx]


def add():
    user = choose_user()
    section = input(f"\nWhat section did {user} modify? ").replace(' ', '')
    while True:
        issue = input("\nWhat issue did this modification solve (just enter the number)? #").strip()
        if not issue.isnumeric():
            continue
        issue = int(issue)
        if issue > 0:
            break

    appendToLogbookTxt(user, section, issue)


def delete():
    while True:
        entry = input("\nWhich entry should be deleted (enter number)? ").strip()
        if entry.isnumeric():
            removeFromLogbookTxt(int(entry))
            break


def updateadoc():
    with open(logbooktxtFilepath, 'r') as file:
        updateLogbookAdoc(file.read())
    print("Updated logbook.adoc")


def start():
    # interactive menu loop so you don't have to rerun the script
    while True:
        addOrDel = input("\nAdd or delete entry? ('a' for add, 'd' for delete, 'u' to update adoc, 'q' to quit): ").strip().lower()
        if addOrDel == 'a':
            # allow consecutive additions
            while True:
                add()
                more = input("\nAdd another entry? (y/n): ").strip().lower()
                if more != 'y':
                    break
        elif addOrDel == 'd':
            delete()
        elif addOrDel in ('u', 'updateadoc'):
            updateadoc()
        elif addOrDel == 'q':
            print("Goodbye!")
            break
        else:
            print("Invalid option. Please choose 'a', 'd', 'u', or 'q'.")

if __name__ == "__main__":
    start()
