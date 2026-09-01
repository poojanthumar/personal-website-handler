CREATE TABLE contact_messages (
    id UUID NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_contact_messages_received_at ON contact_messages (received_at DESC);
