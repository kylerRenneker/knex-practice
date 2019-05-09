create table blogful_articles (
    id INTEGER PRIMARY KEY generated BY DEFAULT as IDENTITY,
    title TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT
);