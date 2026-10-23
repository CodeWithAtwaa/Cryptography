# Function to convert the string to lowercase
from itertools import zip_longest


def toLowerCase(text):
	return text.lower()

# Function to remove all spaces in a string
def removeSpaces(text):
	return text.replace(" ", "")

def FillerLetter(text):
	k = len(text)
	if k % 2 == 0:
		for i in range(0, k, 2):
			if text[i] == text[i+1]:
				new_word = text[0:i+1] + 'x' + text[i+1:]
				new_word = FillerLetter(new_word)
				break
			else:
				new_word = text
	else:
		for i in range(0, k-1, 2):
			if text[i] == text[i+1]:
				new_word = text[0:i+1] + 'x' + text[i+1:]
				new_word = FillerLetter(new_word)
				break
			else:
				new_word = text
	return new_word

def generateDigraphs(text):
    return ["".join(pair) for pair in zip_longest(text[0::2], text[1::2], fillvalue='z')]


# Function to generate the 5x5 key square matrix
def generateKeyTable(key):
    key = removeSpaces(toLowerCase(key))
    alphabet = "abcdefghiklmnopqrstuvwxyz"
    key += alphabet
	#fromkeys() removes duplicates
    key = "".join(dict.fromkeys(key))
    matrix = [key[i:i+5] for i in range(0, 25, 5)]
    return matrix




def search(mat, element):
	for i in range(5):
		for j in range(5):
			if(mat[i][j] == element):
				return i, j


def encrypt_RowRule(matr, e1r, e1c, e2r, e2c):
	char1 = ''
	if e1c == 4:
		char1 = matr[e1r][0]
	else:
		char1 = matr[e1r][e1c+1]

	char2 = ''
	if e2c == 4:
		char2 = matr[e2r][0]
	else:
		char2 = matr[e2r][e2c+1]

	return char1, char2


def encrypt_ColumnRule(matr, e1r, e1c, e2r, e2c):
	char1 = ''
	if e1r == 4:
		char1 = matr[0][e1c]
	else:
		char1 = matr[e1r+1][e1c]

	char2 = ''
	if e2r == 4:
		char2 = matr[0][e2c]
	else:
		char2 = matr[e2r+1][e2c]

	return char1, char2


def encrypt_RectangleRule(matr, e1r, e1c, e2r, e2c):
	char1 = ''
	char1 = matr[e1r][e2c]

	char2 = ''
	char2 = matr[e2r][e1c]

	return char1, char2


def encryptByPlayfairCipher(Matrix, plainList):
	CipherText = []
	for i in range(0, len(plainList)):
		c1 = 0
		c2 = 0
		ele1_x, ele1_y = search(Matrix, plainList[i][0])
		ele2_x, ele2_y = search(Matrix, plainList[i][1])

		if ele1_x == ele2_x:
			c1, c2 = encrypt_RowRule(Matrix, ele1_x, ele1_y, ele2_x, ele2_y)
			# Get 2 letter cipherText
		elif ele1_y == ele2_y:
			c1, c2 = encrypt_ColumnRule(Matrix, ele1_x, ele1_y, ele2_x, ele2_y)
		else:
			c1, c2 = encrypt_RectangleRule(
				Matrix, ele1_x, ele1_y, ele2_x, ele2_y)

		cipher = c1 + c2
		CipherText.append(cipher)
	return CipherText


text_Plain = 'instruments'
text_Plain = removeSpaces(toLowerCase(text_Plain))
text_Plain= FillerLetter(text_Plain)
PlainTextList = generateDigraphs(text_Plain)
print(PlainTextList)

key = "Monarchy"
print("Key text:", key)
key = toLowerCase(key)
Matrix = generateKeyTable(key)

print("Plain Text:", text_Plain)
CipherList = encryptByPlayfairCipher(Matrix, PlainTextList)

CipherText = ""
for i in CipherList:
	CipherText += i
print("CipherText:", CipherText)
print(Matrix)