import {CaseIcon} from '@sanity/icons/Case'
import {CogIcon} from '@sanity/icons/Cog'
import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'
import type {StructureResolver} from 'sanity/structure'

// Sidebar of the Studio, in the order the owner is most likely to need things.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .title('Studio details')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Studio details')),
      S.divider(),
      S.documentTypeListItem('leaderProfile').title('Leadership'),
      S.listItem()
        .title('Portfolio projects')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Portfolio projects')
            .items([
              S.listItem()
                .title('Needs owner review')
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title('Needs owner review')
                    .schemaType('project')
                    .filter('_type == "project" && reviewStatus == "needsReview"')
                    .defaultOrdering([{field: 'order', direction: 'asc'}]),
                ),
              S.documentTypeListItem('project').title('All projects'),
            ]),
        ),
      S.documentTypeListItem('beforeAfterPair').title('Before & after'),
      S.documentTypeListItem('testimonial').title('Client reviews'),
      S.divider(),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('faq').title('FAQs'),
    ])
