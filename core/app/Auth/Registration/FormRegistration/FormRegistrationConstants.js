CasinoConstants
    .constant(
    'REGISTRATION', [
        {
            field: "email",
            type: 'email'
        },
        {
            field: "password",
            type: 'password'
        },
        {
            field: "password_confirmation",
            type: 'password',
            value: ''
        },
        {
            field: "nickname",
            type: 'text'
        },
        {
            field: "first_name",
            type: 'text'
        },
        {
            field: "last_name",
            type: 'text'
        },
        {
            field: "gender",
            type: 'radio'
        },
        {
            field: "full_name",
            type: 'text'
        },
        {
            field: "date_of_birth",
            type: 'date',
            order: 9,
            "required": true,
            "scope": "profile",
            "show_at": ["new"]
        },
        {
            field: "place_of_birth",
            type: 'text'
        },
        {
            field: "personal_id_number",
            type: 'text'
        },
        {
            field: "time_zone",
            type: 'time_zone',
            order: 12,
            "required": true,
            "scope": "profile",
            "show_at": [
                "new"
            ],
            "length": {
                "maximum": 40
            }
        },
        {
            field: "language",
            type: 'language'
        },
        {
            field: "currency",
            type: 'currency'
        },
        {
            field: "country",
            type: 'country'
        },
        {
            field: "city",
            type: 'text'
        },
        {
            field: "address",
            type: 'text'
        },
        {
            field: "postal_code",
            type: 'text'
        },
        {
            field: "address2",
            type: 'text'
        },
        {
            field: "mobile_phone",
            type: 'tel'
        },
        {
            field: "phone",
            type: 'tel'
        },
        {
            field: "skype",
            type: 'text'
        },
        {
            field: "security_question",
            type: 'text'
        },
        {
            field: "security_answer",
            type: 'text'
        },
        {
            field: "bonus_code",
            type: 'text'
        },
        {
            field: "title",
            type: 'text'
        },
        {
            field: "never_call",
            type: 'checkbox',
            default: false
        },
        {
            field: "send_payment_confirmation",
            type: 'checkbox',
            default: false
        },
        {
            field: "receive_promos",
            type: 'checkbox',
            default: true
        },
        {
            field: "receive_newsletters",
            type: 'checkbox',
            default: true
        },
        {
            field: "age_acceptance",
            type: 'checkbox',
            translate_value: {age: 18},
            default: false
        },
        {
            field: "terms_acceptance",
            type: 'checkbox',
            default: false
        }
    ]
)
;
