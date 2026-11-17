CREATE TABLE wedding_rsvps (
 id UUID PRIMARY KEY, name VARCHAR(100) NOT NULL, family_name VARCHAR(100) NOT NULL,
 attendance VARCHAR(5) NOT NULL CHECK (attendance IN ('yes','maybe','no')),
 party_size INTEGER CHECK (party_size BETWEEN 1 AND 30), phone VARCHAR(40), email VARCHAR(254),
 blessing VARCHAR(1500), received_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE TABLE wedding_blessings (
 id UUID PRIMARY KEY, rsvp_id UUID UNIQUE REFERENCES wedding_rsvps(id), name VARCHAR(100) NOT NULL,
 relation VARCHAR(100), message VARCHAR(1500) NOT NULL,
 status VARCHAR(10) NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),
 received_at TIMESTAMP WITH TIME ZONE NOT NULL, moderated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX wedding_rsvps_received_idx ON wedding_rsvps(received_at);
CREATE INDEX wedding_blessings_status_received_idx ON wedding_blessings(status, received_at);
