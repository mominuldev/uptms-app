import type { Quiz } from "@/lib/content";

/** The seeded self-check (uptms-ad packages/quiz/src/Defaults/SelfCheckQuiz.php), as GET /public/quiz serves it. */
export const quizFixture: Quiz = {
    "version": 2,
    "intro": {
        "title": "Let's evaluate your symptoms.",
        "body": "This short questionnaire helps measure levels of depression or anxiety. It takes about three minutes.",
        "start_label": "Start",
        "note": "Encrypted & confidential"
    },
    "privacy_note": "All information is securely stored and confidential.",
    "steps": [
        {
            "key": "name",
            "type": "name",
            "prompt": "First, please tell us your name.",
            "help": "All information is securely stored and confidential.",
            "required": true,
            "layout": "stack",
            "choices": [],
            "scale": null,
            "show_if": []
        },
        {
            "key": "concerns",
            "type": "multi",
            "prompt": "Which of these apply to you?",
            "help": "Select all that apply.",
            "required": false,
            "layout": "grid",
            "choices": [
                {
                    "label": "Depression",
                    "value": "depression",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Anxiety",
                    "value": "anxiety",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Insomnia",
                    "value": "insomnia",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Panic attacks",
                    "value": "panic-attacks",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "OCD",
                    "value": "ocd",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "PTSD",
                    "value": "ptsd",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Social anxiety",
                    "value": "social-anxiety",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Phobia",
                    "value": "phobia",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Postpartum depression",
                    "value": "postpartum-depression",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Burnout",
                    "value": "burnout",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Eating disorder",
                    "value": "eating-disorder",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "I'm not sure",
                    "value": "not-sure",
                    "points": null,
                    "exclusive": true,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "test",
            "type": "single",
            "prompt": "Our providers are trained to help with all of your symptoms.",
            "help": "Which check would you like to take?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Depression check",
                    "value": "depression",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Anxiety check",
                    "value": "anxiety",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Both",
                    "value": "both",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "phq-1",
            "type": "single",
            "prompt": "Little interest or pleasure in doing things",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-2",
            "type": "single",
            "prompt": "Feeling down, depressed, or hopeless",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-3",
            "type": "single",
            "prompt": "Trouble falling or staying asleep, or sleeping too much",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-4",
            "type": "single",
            "prompt": "Feeling tired or having little energy",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-5",
            "type": "single",
            "prompt": "Poor appetite or overeating",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-6",
            "type": "single",
            "prompt": "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-7",
            "type": "single",
            "prompt": "Trouble concentrating on things, such as reading or watching television",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-8",
            "type": "single",
            "prompt": "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around a lot more than usual",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-9",
            "type": "single",
            "prompt": "Thoughts that you would be better off dead, or of hurting yourself",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": true
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": true
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": true
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "depression",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "phq-difficulty",
            "type": "single",
            "prompt": "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
            "help": "Last question of the depression check.",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Extremely difficult",
                    "value": "extremely",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Very difficult",
                    "value": "very",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Somewhat difficult",
                    "value": "somewhat",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not difficult at all",
                    "value": "not-difficult",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "depression",
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "anxiety-next",
            "type": "single",
            "prompt": "Next up is the anxiety check.",
            "help": "These seven questions measure how strong anxiety symptoms are.",
            "required": true,
            "layout": "buttons",
            "choices": [
                {
                    "label": "Skip",
                    "value": "skip",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Continue",
                    "value": "continue",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "both"
                    ]
                }
            ]
        },
        {
            "key": "gad-1",
            "type": "single",
            "prompt": "Feeling nervous, anxious, or on edge",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-2",
            "type": "single",
            "prompt": "Not being able to stop or control worrying",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-3",
            "type": "single",
            "prompt": "Worrying too much about different things",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-4",
            "type": "single",
            "prompt": "Trouble relaxing",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-5",
            "type": "single",
            "prompt": "Being so restless that it's hard to sit still",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-6",
            "type": "single",
            "prompt": "Becoming easily annoyed or irritable",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-7",
            "type": "single",
            "prompt": "Feeling afraid, as if something awful might happen",
            "help": "Over the past 2 weeks, how often have you experienced this?",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Nearly every day",
                    "value": "nearly-every-day",
                    "points": 3,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than half the days",
                    "value": "more-than-half",
                    "points": 2,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Several days",
                    "value": "several-days",
                    "points": 1,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not at all",
                    "value": "not-at-all",
                    "points": 0,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": "anxiety",
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "gad-difficulty",
            "type": "single",
            "prompt": "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
            "help": "Last question of the anxiety check.",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Extremely difficult",
                    "value": "extremely",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Very difficult",
                    "value": "very",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Somewhat difficult",
                    "value": "somewhat",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Not difficult at all",
                    "value": "not-difficult",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "test",
                    "op": "in",
                    "values": [
                        "anxiety",
                        "both"
                    ]
                },
                {
                    "step": "anxiety-next",
                    "op": "not_in",
                    "values": [
                        "skip"
                    ]
                }
            ]
        },
        {
            "key": "main-symptom",
            "type": "single",
            "prompt": "Which one of these symptoms is the *most* challenging for you right now?",
            "help": "Please choose one.",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Sleep issues",
                    "value": "sleep-issues",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Lack of energy or motivation",
                    "value": "lack-of-energy-or-motivation",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Anxious or worrying too much",
                    "value": "anxious-or-worrying-too-much",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Easily irritable",
                    "value": "easily-irritable",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Concentration issues",
                    "value": "concentration-issues",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Sadness or hopelessness",
                    "value": "sadness-or-hopelessness",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Other",
                    "value": "other",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "duration",
            "type": "single",
            "prompt": "How long have you been experiencing these issues?",
            "help": "Please choose one.",
            "required": true,
            "layout": "stack",
            "choices": [
                {
                    "label": "Recently, 0–2 weeks",
                    "value": "weeks",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Starting to worsen, 2 weeks – 2 months",
                    "value": "months",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "For a while, 2–12 months",
                    "value": "year",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "For a long time, 1–2 years",
                    "value": "years",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Far too long, more than 2 years",
                    "value": "long",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "tried-treatment",
            "type": "single",
            "prompt": "Have you ever tried any treatment for depression or anxiety?",
            "help": "For example therapy, medication or TMS.",
            "required": true,
            "layout": "buttons",
            "choices": [
                {
                    "label": "Yes",
                    "value": "yes",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "No",
                    "value": "no",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "treatments",
            "type": "multi",
            "prompt": "Which types of treatment have you tried?",
            "help": "Select all that apply.",
            "required": true,
            "layout": "stack",
            "choices": [
                {
                    "label": "Antidepressants (e.g. Prozac, Wellbutrin)",
                    "value": "antidepressants",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "In-person therapy",
                    "value": "in-person-therapy",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Teletherapy (video or phone)",
                    "value": "teletherapy",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "TMS (magnetic brain stimulation)",
                    "value": "tms",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Spravato or ketamine",
                    "value": "ketamine",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "ECT",
                    "value": "ect",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Other medications (e.g. Ambien, Xanax)",
                    "value": "other-medications",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "None of the above",
                    "value": "none",
                    "points": null,
                    "exclusive": true,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "tried-treatment",
                    "op": "in",
                    "values": [
                        "yes"
                    ]
                }
            ]
        },
        {
            "key": "tms-worked",
            "type": "single",
            "prompt": "Did TMS work for you?",
            "help": "It usually has good results.",
            "required": true,
            "layout": "buttons",
            "choices": [
                {
                    "label": "Yes",
                    "value": "yes",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "No",
                    "value": "no",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "treatments",
                    "op": "in",
                    "values": [
                        "tms"
                    ]
                }
            ]
        },
        {
            "key": "antidepressant-count",
            "type": "single",
            "prompt": "About how many antidepressants have you tried?",
            "help": "This gives us an idea of treatment resistance.",
            "required": true,
            "layout": "select",
            "choices": [
                {
                    "label": "1",
                    "value": "1",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "2",
                    "value": "2",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "3",
                    "value": "3",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "4",
                    "value": "4",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "5",
                    "value": "5",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "6 or more",
                    "value": "6-or-more",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "treatments",
                    "op": "in",
                    "values": [
                        "antidepressants"
                    ]
                }
            ]
        },
        {
            "key": "therapy-sessions",
            "type": "single",
            "prompt": "About how many sessions of therapy have you had?",
            "help": "Includes group therapy, couples counseling, or anything like that.",
            "required": true,
            "layout": "grid",
            "choices": [
                {
                    "label": "Just one",
                    "value": "one",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Fewer than 6",
                    "value": "under-6",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "6–8",
                    "value": "6-8",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "More than 8",
                    "value": "over-8",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": [
                {
                    "step": "treatments",
                    "op": "in",
                    "values": [
                        "in-person-therapy",
                        "teletherapy"
                    ]
                }
            ]
        },
        {
            "key": "life-events",
            "type": "multi",
            "prompt": "Are any life events contributing to how you're feeling?",
            "help": "Select all that apply.",
            "required": false,
            "layout": "stack",
            "choices": [
                {
                    "label": "A transition or stressor (e.g. job loss, a move)",
                    "value": "a-transition-or-stressor-e-g-j",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Relationship or family challenges",
                    "value": "relationship-or-family-challen",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Work or school",
                    "value": "work-or-school",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Health or medical challenges",
                    "value": "health-or-medical-challenges",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Loss of a loved one",
                    "value": "loss-of-a-loved-one",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Political or world events",
                    "value": "political-or-world-events",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "Other",
                    "value": "other",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "email",
            "type": "email",
            "prompt": "What's the best email to reach you?",
            "help": "The clinic replies from a secure inbox. Your answers are never emailed.",
            "required": true,
            "layout": "stack",
            "choices": [],
            "scale": null,
            "show_if": []
        },
        {
            "key": "phone",
            "type": "phone",
            "prompt": "Let's talk about what your results mean.",
            "help": "Your results are on the next screen. A care coordinator will call to go through them with you.",
            "required": true,
            "layout": "stack",
            "choices": [],
            "scale": null,
            "show_if": []
        },
        {
            "key": "depression-results",
            "type": "results",
            "prompt": "",
            "help": "Your score is out of 27, based on the PHQ-9.",
            "required": false,
            "layout": "stack",
            "choices": [],
            "scale": "depression",
            "show_if": []
        },
        {
            "key": "anxiety-results",
            "type": "results",
            "prompt": "",
            "help": "Your score is out of 21, based on the GAD-7.",
            "required": false,
            "layout": "stack",
            "choices": [],
            "scale": "anxiety",
            "show_if": []
        },
        {
            "key": "helpful",
            "type": "single",
            "prompt": "Was this self-check helpful?",
            "help": "Let us know.",
            "required": false,
            "layout": "buttons",
            "choices": [
                {
                    "label": "Yes",
                    "value": "yes",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                },
                {
                    "label": "No",
                    "value": "no",
                    "points": null,
                    "exclusive": false,
                    "crisis": false
                }
            ],
            "scale": null,
            "show_if": []
        },
        {
            "key": "improve",
            "type": "text",
            "prompt": "What can we do better?",
            "help": "We read every note.",
            "required": false,
            "layout": "stack",
            "choices": [],
            "scale": null,
            "show_if": []
        }
    ],
    "scales": [
        {
            "key": "depression",
            "label": "Depression",
            "instrument": "PHQ-9",
            "title": "Results of your depression check",
            "bands": [
                {
                    "min": 0,
                    "max": 4,
                    "title": "Minimal depression",
                    "body": "Your score suggests you may not need depression treatment. Talk with your physician if symptoms persist."
                },
                {
                    "min": 5,
                    "max": 9,
                    "title": "Mild depression",
                    "body": "Your score suggests you should speak in depth with your physician or a psychiatrist to assess further."
                },
                {
                    "min": 10,
                    "max": 14,
                    "title": "Moderate depression",
                    "body": "Your score suggests you should speak in depth with a psychiatrist to find a treatment that works for you."
                },
                {
                    "min": 15,
                    "max": 19,
                    "title": "Moderately severe depression",
                    "body": "Your score warrants treatment for depression with medication, therapy or both. If medication and therapy haven't helped, ask about an interventional treatment like Deep TMS."
                },
                {
                    "min": 20,
                    "max": 27,
                    "title": "Severe depression",
                    "body": "Your score warrants treatment for depression with medication, therapy or both. If medication and therapy haven't helped, ask about an interventional treatment like Deep TMS."
                }
            ]
        },
        {
            "key": "anxiety",
            "label": "Anxiety",
            "instrument": "GAD-7",
            "title": "Results of your anxiety check",
            "bands": [
                {
                    "min": 0,
                    "max": 4,
                    "title": "Minimal anxiety",
                    "body": "Your score suggests you may not need anxiety treatment. Talk with your physician if symptoms persist."
                },
                {
                    "min": 5,
                    "max": 9,
                    "title": "Mild anxiety",
                    "body": "Your score suggests you should speak in depth with your physician or a psychiatrist to assess further."
                },
                {
                    "min": 10,
                    "max": 14,
                    "title": "Moderate anxiety",
                    "body": "Your score may warrant treatment for anxiety with medication, therapy or both. If they haven't worked, ask your psychiatrist about interventional treatments like Deep TMS."
                },
                {
                    "min": 15,
                    "max": 21,
                    "title": "Severe anxiety",
                    "body": "Your score warrants treatment for anxiety with medication, therapy or both. If they haven't worked, ask your psychiatrist about interventional treatments like Deep TMS."
                }
            ]
        }
    ],
    "crisis": {
        "title": "If you are thinking about hurting yourself, help is available right now.",
        "body": "Call or text 988 (Suicide & Crisis Lifeline) any time, day or night. If you are in immediate danger, call 911. You can finish the self-check afterwards."
    },
    "result_disclaimer": "This self-check is a screening tool, not a diagnosis. A qualified provider decides on treatment after a full evaluation.",
    "done": {
        "title": "Thank you. The clinic will be in touch.",
        "body": "A care coordinator will call within one business day to talk through your results and answer your questions.",
        "primary": {
            "label": "Learn about Deep TMS",
            "href": "/tms"
        },
        "secondary": {
            "label": "Call {phone}",
            "href": "tel:clinic"
        }
    }
};
