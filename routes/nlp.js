const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const SpellCorrector = require('spelling-corrector');
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = require('natural');
const SW = require('stopword');

const router = express.Router();

router.post('/sentiment-analyzer', function(req, res, next) {
    try {
        const { review } = req.body;
        const lexedReview = aposToLexForm(review);
        const alphaOnlyReview = lexedReview.toLowerCase().replace(/[^a-zA-Z\s]+/g, '');
      
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
      
        const spellCorrector = new SpellCorrector();
        
        tokenizedReview.forEach((word, index) => {
          tokenizedReview[index] = spellCorrector.correct(word);
        });
      
        const filteredReview = SW.removeStopwords(tokenizedReview);
      
        const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
        const analysis = analyzer.getSentiment(filteredReview);
      
        return res.status(200).json({ analysis });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

module.exports = router;