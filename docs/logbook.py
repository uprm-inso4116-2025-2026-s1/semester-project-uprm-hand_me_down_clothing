import os
usernames = ('anthonyharriel','yamilette-alemany','Kaariinaa08','kevgom018','1uismar33r0','kian-robert','jankii03','jahsyelrojas','angelvillegas1','leanelys','nicolasrivera25','FabiolaZTorres','JorgeDeLeonOrama','devlin-hahn04','GabyMarr','Alma-pineiro','Lorenzo-PT','KennethSepu1','Jachikasielu','JoshDG03','JuanIranzo','Ojani','andreasegarra','J3SSY-ANDU','daniellameleroo')
logbooktxtFilepath = os.path.join(os.path.dirname(__file__), 'logbook.txt')
logbookadocFilepath = os.path.join(os.path.dirname(__file__), os.path.join('sections', 'logbook.adoc'))

def updateLogbookAdoc(logbooktxt):
  entries = logbooktxt.split('\n')

  # format: { <user>: sections: { sections: <section>: [<issue>, <issue>, ...] }
  users = {}

  for entry in entries:
    if entry.strip() == '': continue

    _, _, username, _, _, section, _, _, issue = entry.split(' ')
    issue = issue[1:]

    if username not in users: users[username] = { 'sections': {} }
    
    user = users[username]
    
    if section not in user['sections']:
      user['sections'][section] = []

    if issue not in user['sections'][section]:
      user['sections'][section].append(issue)

  # adding user entries in alphabetical order to logbook
  resultString = \
  "=== Logbook\n\n" \
  "[%header]\n" \
  "|===\n" \
  "| Person |  Sections worked on\n" \

  for username in sorted(users.keys()): 

    formattedSections = []
    for section in sorted(users[username]['sections'].keys()):
      formattedIssues = []
      for issue in sorted(users[username]['sections'][section]):
        formattedIssues.append(f"link:https://github.com/uprm-inso4116-2025-2026-s1/semester-project-uprm-hand_me_down_clothing/issues/{issue}[#{issue}]")
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

    if newEntry[newEntry.index(':'):] in txt != -1:
      print("This entry already exists in the logbook.")
    else:
      file.seek(0)
      file.write(newTxt)

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
  # when entry is the last one in the file
  if endIndex == -1: endIndex = len(txt)

  newTxt = txt[:entryIndex] + txt[endIndex+1:]

  with open(logbooktxtFilepath, 'w') as file:
    file.write(newTxt)
    
  updateLogbookAdoc(newTxt)

  print("\nRemoved the following entry from the logbook:\n" + txt[entryIndex:endIndex])
  
def add():
  for i in range(len(usernames)):
    print(str(i) + ':', usernames[i])

  while (True):
    user = input("\nWhich user (enter number)? ")
    if not user.isnumeric(): continue
    user = int(user)
    if user > 0 and user < len(usernames): break

  section = input(f"\nWhat section did {usernames[user]} modify? ").replace(' ', '')

  while (True):
    issue = input("\nWhat issue did this modification solve (just enter the number)? #")
    if not issue.isnumeric(): continue
    issue = int(issue)
    if issue > 0: break

  appendToLogbookTxt(usernames[user], section, issue)
  
def delete():
  while (True):
    entry = input("\nWhich entry should be deleted (enter number)? ")
    if not entry.isnumeric(): continue
    entry = int(entry)
    break

  removeFromLogbookTxt(entry)

def updateadoc():
  with open(logbooktxtFilepath, 'r') as file:
    updateLogbookAdoc(file.read())

  print("Updated logbook.adoc")


def start():
  addOrDel = input("Add or delete entry? ('a' for add, 'd' for delete, 'q to quit): ").lower()
  if addOrDel == 'a': add()
  elif addOrDel == 'd': delete()
  elif addOrDel == 'q': return
  elif addOrDel == 'updateadoc': updateadoc()
  else: start()

if __name__ == "__main__":
  start()