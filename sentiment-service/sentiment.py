from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# classifier = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')

# checks field of journalText has a string input when SentimentAnalysis is passed in as parameter
class SentimentAnalysis(BaseModel):
  journalText: str

# analyzes sentiment of journal entry text
@app.post('/api/sentiment')
def analyze_sentiment(journal_entry: SentimentAnalysis):
  user_text = journal_entry.journalText
  try:
    classifier = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')
    res = classifier(user_text)[0]
    label = res['label']

    # uses confidence score as a proxy for positivity score
    score = res['score']
    if label == 'NEGATIVE':
      score = 1 - score
    return {'score': score}
  except Exception as e:
    raise HTTPException(status_code=500, detail='Sentiment analysis failed. Please try again')