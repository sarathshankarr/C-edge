# GRN Checking, on Mobile -- What This Is

## In one paragraph

Right now, checking in fabric and raw-material deliveries against a
Purchase Order -- looking at what a lot/bale contains, scanning or typing
in what was actually received, submitting it, and approving it -- only
works from a computer browser. This project makes that same set of
actions available to a mobile app instead, without changing anything
about how the computer version works today. Both will run side by side.

## Why this matters

Checkers are often standing next to the actual fabric rolls and bales on
the warehouse floor, not sitting at a desk. Being able to open a PO,
photograph a vendor's packing slip, and record checked quantities directly
from a phone removes a round trip to a computer for every single lot.

## What's included

- Seeing the list of purchase orders waiting to be checked.
- Opening one PO and seeing every lot, every bale, and every piece inside
  it -- what was ordered, what's been received, what's been checked so
  far.
- Typing in checked quantities by hand, lot by lot, bale by bale.
- Uploading a photo of a vendor's packing slip and letting the AI read the
  handwritten numbers off it automatically, instead of typing every number
  by hand.
- Submitting a bale (or an RM line item) once it's been checked, and
  approving a batch of them once submitted -- the same two-step review
  process the computer version uses today.
- Downloading the same PDF paperwork the computer version produces (the
  official GRN receipt, and the printable "draft worksheet" a checker can
  hand-write onto).

## What's explicitly NOT included (for now)

The barcode feature -- generating and printing barcode labels for lots,
bales, and individual pieces -- was deliberately left out of this project.
It's a separate, not-yet-finalized feature on the computer side, and
mobile will get it later once that's settled.

## What's actually new here, and what already existed

Almost none of the underlying logic is new. The exact same rules that
govern the computer version -- what counts as a valid checked quantity,
when a bale can be submitted, what happens if a vendor's document doesn't
match the PO it was uploaded against -- are reused as-is. What this
project actually built is a new *doorway* into that same logic: a set of
requests a mobile app can make and get plain, structured answers back
from, instead of the full webpage the computer version sends back.

One thing genuinely didn't exist before and had to be built: a single
request that hands back everything about one PO's checking status in one
go (all its lots, bales, quantities, and history) -- the computer version
already gathers all of that, but it was baked directly into the webpage
itself rather than being available on its own. That's the one new thing.

## How someone logs in from the phone

The computer version keeps you logged in the way a browser normally does
-- you log in once, and the browser quietly proves who you are on every
click after that. A phone app doesn't work that way naturally, so instead,
this project has the mobile app send its username and password along with
*every single request* it makes. This matches how a couple of other
existing mobile-style features in this same system already work, so it's
a familiar pattern for whoever builds the app, not something invented
from scratch for this project.

The one thing worth knowing: this approach is simple to build and matches
what already exists, but it is not the most modern or most secure way to
handle logins on a phone (that would normally involve a temporary "access
token" instead of the password itself). That tradeoff was a deliberate
choice for this phase, not an oversight -- upgrading it later is possible
without changing anything else about how the mobile app works.

## Is this actually working, or just planned?

As of this writing, it's built, running, and has been tested against
real data on a local test server -- including a real photo upload that
went all the way through to the AI reading it and the result being saved
correctly. It has not yet been tried against the live production servers,
and the mobile app itself hasn't been built yet -- what exists today is
the "waiter" that the not-yet-built mobile app will place its orders
through.
