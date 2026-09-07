
const express = require('express');
const router = express.Router();

const StudentProfile = require('../models/StudentProfile');

// ============================================================
// STOP WORDS
// ============================================================

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'to',
  'in',
  'on',
  'for',
  'with',
  'from',
  'by',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'how',
  'why',
  'what',
  'when',
  'where',
  'which',
  'who',
  'whom',
  'whose',
  'this',
  'that',
  'these',
  'those',
  'about',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'under',
  'over',
  'can',
  'could',
  'should',
  'would',
  'will',
  'may',
  'might',
  'do',
  'does',
  'did',
  'work',
  'works',
  'working',
  'used',
  'use',
  'using',
  'student',
  'students',
  'research',
  'researcher',
  'researchers',
  'study',
  'studies',
  'project',
  'projects'
]);

// ============================================================
// RELATED TERMS
// ============================================================

const RELATED_TERMS = {
  ai: [
    'ai',
    'artificial intelligence',
    'machine learning',
    'ml',
    'deep learning',
    'neural network',
    'neural networks',
    'computer vision',
    'nlp',
    'natural language processing'
  ],

  'data science': [
    'data science',
    'data analytics',
    'analytics',
    'big data',
    'machine learning',
    'artificial intelligence',
    'ai'
  ],

  agriculture: [
    'agriculture',
    'agricultural',
    'farming',
    'farm',
    'agri',
    'crop',
    'crops'
  ],

  'precision agriculture': [
    'precision agriculture',
    'precision farming',
    'smart farming',
    'smart agriculture',
    'agriculture iot',
    'agri iot',
    'iot agriculture'
  ],

  'plant pathology': [
    'plant pathology',
    'plant disease',
    'crop disease',
    'disease detection',
    'plant diseases',
    'pest disease'
  ],

  'crop genetics': [
    'crop genetics',
    'plant genetics',
    'genetics',
    'genomics',
    'crop breeding',
    'plant breeding'
  ],

  'soil science': [
    'soil science',
    'soil',
    'soil health',
    'soil analysis',
    'soil fertility'
  ],

  'irrigation water': [
    'irrigation',
    'water management',
    'water',
    'water resources',
    'smart irrigation'
  ],

  robotics: [
    'robotics',
    'robot',
    'agri robotics',
    'agricultural robotics',
    'automation'
  ],

  climate: [
    'climate',
    'climate change',
    'environment',
    'environmental science',
    'sustainability',
    'sustainable agriculture'
  ]
};

// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(value) {
  if (!value) {
    return '';
  }

  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================
// TOKENIZE
// ============================================================

function tokenize(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(' ')
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word));
}

// ============================================================
// EXPAND TERMS
// ============================================================

function expandTerms(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return new Set();
  }

  const result = new Set(
    tokenize(normalized)
  );

  Object.values(RELATED_TERMS).forEach(
    (group) => {
      const normalizedGroup =
        group.map(normalizeText);

      const matched =
        normalizedGroup.some((term) => {
          return (
            normalized === term ||
            normalized.includes(term) ||
            term.includes(normalized)
          );
        });

      if (matched) {
        group.forEach((term) => {
          tokenize(term).forEach((word) => {
            result.add(word);
          });
        });
      }
    }
  );

  return result;
}

// ============================================================
// SIMILARITY
// ============================================================

function similarity(firstValue, secondValue) {
  if (!firstValue || !secondValue) {
    return 0;
  }

  const first =
    expandTerms(firstValue);

  const second =
    expandTerms(secondValue);

  if (
    first.size === 0 ||
    second.size === 0
  ) {
    return 0;
  }

  let matches = 0;

  first.forEach((word) => {
    if (second.has(word)) {
      matches += 1;
    }
  });

  // Jaccard-style score.
  // This prevents very short queries from
  // incorrectly producing 100% matches.
  const union = new Set([
    ...first,
    ...second
  ]);

  if (union.size === 0) {
    return 0;
  }

  return matches / union.size;
}

// ============================================================
// ARRAY SIMILARITY
// ============================================================

function arraySimilarity(
  firstArray,
  secondArray
) {
  const first =
    Array.isArray(firstArray)
      ? firstArray.filter(Boolean)
      : [];

  const second =
    Array.isArray(secondArray)
      ? secondArray.filter(Boolean)
      : [];

  if (
    first.length === 0 ||
    second.length === 0
  ) {
    return 0;
  }

  let bestScore = 0;

  first.forEach((firstItem) => {
    second.forEach((secondItem) => {
      const score = similarity(
        firstItem,
        secondItem
      );

      if (score > bestScore) {
        bestScore = score;
      }
    });
  });

  const combinedScore = similarity(
    first.join(' '),
    second.join(' ')
  );

  return Math.max(
    bestScore,
    combinedScore
  );
}

// ============================================================
// FUNDING
// ============================================================

function fundingMatches(
  companyFunding,
  studentFunding
) {
  const company =
    String(
      companyFunding || 'either'
    )
      .toLowerCase()
      .trim();

  const student =
    String(
      studentFunding || 'either'
    )
      .toLowerCase()
      .trim();

  if (
    company === 'either' ||
    company === 'both'
  ) {
    return true;
  }

  if (student === 'either') {
    return true;
  }

  return company === student;
}

function fundingScore(
  companyFunding,
  studentFunding
) {
  return fundingMatches(
    companyFunding,
    studentFunding
  )
    ? 1
    : 0;
}

// ============================================================
// STUDENT RESEARCH DATA
// ============================================================

function getStudentResearchData(student) {
  return {
    researchArea:
      student.researchArea || '',

    researchTopic:
      student.researchTopic || '',

    researchKeywords:
      Array.isArray(
        student.researchKeywords
      )
        ? student.researchKeywords
        : [],

    researchNiches:
      Array.isArray(
        student.researchNiches
      )
        ? student.researchNiches
        : [],

    customResearchNiche:
      student.customResearchNiche || '',

    researchInterests:
      Array.isArray(
        student.researchInterests
      )
        ? student.researchInterests.join(' ')
        : student.researchInterests || '',

    skills:
      Array.isArray(student.skills)
        ? student.skills
        : [],

    projectTitle:
      student.projectTitle || '',

    description:
      student.description ||
      student.bio ||
      ''
  };
}

// ============================================================
// MATCH SCORE
// ============================================================

function calculateMatchScore(
  student,
  search
) {
  const data =
    getStudentResearchData(student);

  const selectedTopic =
    search.topic || '';

  const selectedKeyword =
    search.keyword || '';

  const selectedResearchTopic =
    search.researchTopic || '';

  // ----------------------------------------------------------
  // TOPIC = 35%
  // ----------------------------------------------------------

  let topicScore = 0;

  if (selectedTopic) {
    const studentTopics = [
      data.researchArea,
      ...data.researchNiches,
      data.customResearchNiche
    ].filter(Boolean);

    studentTopics.forEach(
      (studentTopic) => {
        topicScore = Math.max(
          topicScore,
          similarity(
            selectedTopic,
            studentTopic
          )
        );
      }
    );
  }

  // ----------------------------------------------------------
  // KEYWORD = 25%
  // ----------------------------------------------------------

  let keywordScore = 0;

  if (selectedKeyword) {
    keywordScore = Math.max(
      keywordScore,

      arraySimilarity(
        [selectedKeyword],
        data.researchKeywords
      ),

      similarity(
        selectedKeyword,
        data.researchArea
      ),

      similarity(
        selectedKeyword,
        data.researchTopic
      ),

      similarity(
        selectedKeyword,
        data.researchInterests
      ),

      arraySimilarity(
        [selectedKeyword],
        data.skills
      )
    );
  }

  // ----------------------------------------------------------
  // RESEARCH TOPIC = 25%
  // ----------------------------------------------------------

  let researchTopicScore = 0;

  if (selectedResearchTopic) {
    researchTopicScore = Math.max(
      researchTopicScore,

      similarity(
        selectedResearchTopic,
        data.researchTopic
      ),

      similarity(
        selectedResearchTopic,
        data.researchArea
      ),

      similarity(
        selectedResearchTopic,
        data.projectTitle
      ),

      similarity(
        selectedResearchTopic,
        data.researchInterests
      ),

      similarity(
        selectedResearchTopic,
        data.description
      )
    );
  }

  // ----------------------------------------------------------
  // SKILLS / INTERESTS = 5%
  // ----------------------------------------------------------

  let skillsScore = 0;

  if (selectedKeyword) {
    skillsScore = Math.max(
      skillsScore,

      arraySimilarity(
        [selectedKeyword],
        data.skills
      ),

      similarity(
        selectedKeyword,
        data.researchInterests
      )
    );
  }

  // ----------------------------------------------------------
  // FUNDING = 10%
  // ----------------------------------------------------------

  const fundingScoreValue =
    fundingScore(
      search.funding,
      student.fundingPreference
    );

  // ----------------------------------------------------------
  // FINAL SCORE
  // ----------------------------------------------------------

  const finalScore =
    topicScore * 35 +
    keywordScore * 25 +
    researchTopicScore * 25 +
    skillsScore * 5 +
    fundingScoreValue * 10;

  return Math.round(
    finalScore
  );
}

// ============================================================
// GET ALL / MATCHING STUDENTS
// GET /api/students
// ============================================================

router.get('/', async (req, res) => {
  try {
    const {
      keywords,
      funding,
      specific,
      topic,
      keyword,
      researchTopic
    } = req.query;

    const selectedTopic =
      typeof topic === 'string'
        ? topic.trim()
        : '';

    const selectedKeyword =
      typeof keyword === 'string'
        ? keyword.trim()
        : '';

    const selectedResearchTopic =
      typeof researchTopic === 'string'
        ? researchTopic.trim()
        : '';

    const specificSearch =
      typeof specific === 'string'
        ? specific.trim()
        : '';

    const fundingFilter =
      typeof funding === 'string'
        ? funding.trim().toLowerCase()
        : 'either';

    // ----------------------------------------------------------
    // OLD KEYWORDS SUPPORT
    // ----------------------------------------------------------

    let oldKeywords = [];

    if (
      typeof keywords === 'string'
    ) {
      oldKeywords =
        keywords
          .split(',')
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
    }

    const effectiveKeyword =
      selectedKeyword ||
      oldKeywords.join(' ');

    const effectiveResearchTopic =
      selectedResearchTopic ||
      specificSearch;

    const hasSearch =
      Boolean(selectedTopic) ||
      Boolean(effectiveKeyword) ||
      Boolean(effectiveResearchTopic);

    console.log(
      '--------------------------------------------'
    );

    console.log(
      'STUDENT MATCH SEARCH'
    );

    console.log({
      topic: selectedTopic,
      keyword: effectiveKeyword,
      researchTopic:
        effectiveResearchTopic,
      funding: fundingFilter
    });

    console.log(
      '--------------------------------------------'
    );

    // ----------------------------------------------------------
    // LOAD STUDENTS
    // ----------------------------------------------------------

    const students =
      await StudentProfile
        .find({
          availableForCollaboration: {
            $ne: false
          }
        })
        .lean();

    console.log(
      `Students loaded from MongoDB: ${students.length}`
    );

    // ----------------------------------------------------------
    // NO SEARCH
    // ----------------------------------------------------------

    if (!hasSearch) {
      return res.json(
        students.map(
          (student) => ({
            ...student,
            matchScore: 0
          })
        )
      );
    }

    // ----------------------------------------------------------
    // SEARCH OBJECT
    // ----------------------------------------------------------

    const search = {
      topic: selectedTopic,
      keyword: effectiveKeyword,
      researchTopic:
        effectiveResearchTopic,
      funding: fundingFilter
    };

    // ----------------------------------------------------------
    // CALCULATE MATCHES
    // ----------------------------------------------------------

    const scoredStudents =
      students.map(
        (student) => {
          const score =
            calculateMatchScore(
              student,
              search
            );

          return {
            ...student,
            matchScore: score
          };
        }
      );

    console.log(
      'SCORED STUDENTS:',
      scoredStudents.map(
        (student) => ({
          name: student.name,
          researchArea:
            student.researchArea,
          researchTopic:
            student.researchTopic,
          keywords:
            student.researchKeywords,
          score:
            student.matchScore
        })
      )
    );

    // ----------------------------------------------------------
    // MINIMUM RESEARCH MATCH
    // ----------------------------------------------------------

    let results =
      scoredStudents.filter(
        (student) =>
          student.matchScore >= 15
      );

    // ----------------------------------------------------------
    // FUNDING FILTER
    // ----------------------------------------------------------

    if (
      fundingFilter === 'free' ||
      fundingFilter === 'stipend'
    ) {
      results =
        results.filter(
          (student) =>
            fundingMatches(
              fundingFilter,
              student.fundingPreference
            )
        );
    }

    // ----------------------------------------------------------
    // SORT
    // ----------------------------------------------------------

    results.sort(
      (a, b) =>
        (b.matchScore || 0) -
        (a.matchScore || 0)
    );

    console.log(
      'FINAL MATCH RESULTS:',
      results.map(
        (student) => ({
          name: student.name,
          score:
            student.matchScore
        })
      )
    );

    return res.json(results);
  } catch (error) {
    console.error(
      'Student matching error:',
      error
    );

    return res.status(500).json({
      error:
        'Failed to find matching researchers.',
      details:
        error.message
    });
  }
});

// ============================================================
// GET ONE STUDENT
// GET /api/students/:userId
// ============================================================

router.get(
  '/:userId',
  async (req, res) => {
    try {
      const student =
        await StudentProfile.findOne({
          userId: req.params.userId
        }).lean();

      if (!student) {
        return res.status(404).json({
          error:
            'Student profile not found.'
        });
      }

      return res.json(student);
    } catch (error) {
      console.error(
        'Get student profile error:',
        error
      );

      return res.status(500).json({
        error:
          'Failed to load student profile.'
      });
    }
  }
);

// ============================================================
// CREATE / UPDATE STUDENT
// POST /api/students
// ============================================================

router.post(
  '/',
  async (req, res) => {
    try {
      const {
        userId,
        ...rest
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          error:
            'userId is required.'
        });
      }

      const updated =
        await StudentProfile.findOneAndUpdate(
          { userId },

          {
            userId,
            ...rest,
            updatedAt:
              rest.updatedAt ||
              new Date().toISOString()
          },

          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          }
        ).lean();

      return res.json(updated);
    } catch (error) {
      console.error(
        'Save student profile error:',
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          'Failed to save student profile.'
      });
    }
  }
);

module.exports = router;
