from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import pipeline
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from dotenv import load_dotenv

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter

# loads API_KEY for accessing sentiment-service from .env file
API_KEY = os.getenv('SENTIMENT_SERVICE_API_KEY')

# checks API key matches that expected from the backend before allowing any calls to functions
@app.middleware('http')
async def check_api_key(request: Request, call_next):
  if request.headers.get('x-api-key') != API_KEY:
    return JSONResponse(
      status_code=401,
      content={'error': 'You are not authorized to use this resource'}
      )
  return await call_next(request)

# error message if user exceeds limit
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
  return JSONResponse(
    status_code=429, content={'error': 'Maximum allowable number of requests exceeded'}
  )

classifier = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')

# checks field of journalText has a string input when SentimentAnalysis is passed in as parameter
class SentimentAnalysis(BaseModel):
  journalText: str

@app.get('/')
@limiter.limit('5/hour')
def root(request: Request):
  return {'status': 'ok'}

# analyzes sentiment of journal entry text
@app.post('/api/sentiment')
@limiter.limit('10/hour')
def analyze_sentiment(journal_entry: SentimentAnalysis, request: Request):
  user_text = journal_entry.journalText
  try:
    res = classifier(user_text)[0]
    label = res['label']

    # uses confidence score as a proxy for positivity score
    score = res['score']
    if label == 'NEGATIVE':
      score = 1 - score
    return {'score': score}
  except Exception as e:
    raise HTTPException(status_code=500, detail='Sentiment analysis failed. Please try again')