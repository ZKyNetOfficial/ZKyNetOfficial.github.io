# Remaining Issues & Manual Fixes Needed

## Contact Form Backend Integration
- **Issue**: Contact form currently shows success messages but doesn't actually send emails to contact@zkynet.org
- **Status**: Placeholder functionality in place
- **Action Required**: Integrate with backend service to handle form submissions and send emails
- **File**: `index.html:1785` - `handleContactForm()` function

## Newsletter Signup Backend Integration
- **Issue**: Newsletter signup form needs backend integration for email collection
- **Status**: Placeholder functionality in place
- **Action Required**: Connect to your backend service that stores emails in JSON format
- **File**: `index.html:1775` - `handleNewsletterSignup()` function

## Node Operator Program Backend Integration
- **Issue**: Node operator signup needs backend integration
- **Status**: Form simplified to email-only as requested, placeholder functionality in place
- **Action Required**: Connect to your backend service (~/Workspace/VPN/Backend/usr-*) for email collection
- **File**: `index.html:1780` - `handleNodeOperatorSignup()` function

## External Links That May Need Updates
- **GitHub Link**: Updated to point to `https://github.com/ZKyNetOfficial` ✅
- **Documentation Link**: Currently points to `https://docs.zkynet.org` - verify this domain is set up
- **Reddit Link**: Added `https://reddit.com/u/ZKyNetOfficial` ✅
- **File**: `index.html:1633-1635`

## Placeholder Links in Terms Files
The following links in terms files still point to placeholder URLs and may need actual URLs when services are available:
- **Governance Forum**: `forum.zkynet.org` (terms-future.html:392)
- **Technical Documentation**: `docs.zkynet.org` (terms-future.html:393)
- **Network Status**: `status.zkynet.org` (terms-future.html:394)
- **GitHub Organization**: Updated to `github.com/ZKyNetOfficial` ✅ (terms-future.html:395)

## Fixed Items (No Further Action Needed)
✅ Contact form - removed node operator program option from subject dropdown
✅ Node operator form - simplified to email-only to match backend structure
✅ Company name - updated from "ZKyNet Privacy Infrastructure Inc." to "ZKyNet™" throughout site
✅ Footer navigation - fixed GitHub and Documentation links
✅ Partnership button - now routes to contact page

## Notes
- All forms are currently using placeholder JavaScript functions that show success messages
- The backend integration will need to replace these placeholder functions with actual API calls
- Email addresses (contact@, support@, legal@, privacy@zkynet.org) are correctly configured throughout the site