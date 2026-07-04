// The view owner's tags, exposed to guests so they can tag the messages
// (questions) they send. Minimal shape needed to render + select a tag.
export interface PublicTag {
  id: string;
  name: string;
  color: string;
}
