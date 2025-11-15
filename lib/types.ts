import { Deal, DealStage, Stakeholder, BuyerType, Document, DocumentType, DocumentSource, NextAction, GeneratedContent, GeneratedContentType, CustomAngle } from '@prisma/client'

export type { Deal, DealStage, Stakeholder, BuyerType, Document, DocumentType, DocumentSource, NextAction, GeneratedContent, GeneratedContentType, CustomAngle }

export type DealWithRelations = Deal & {
  stakeholders: Stakeholder[]
  documents: Document[]
  nextActions: NextAction[]
  generatedContent: GeneratedContent[]
  customAngles: CustomAngle[]
}

export type DealListItem = Deal & {
  _count: {
    nextActions: number
  }
  uncheckedNextActions: number
}

export interface CreateDealInput {
  name: string
  clientFullName: string
  clientEmail: string
  clientWebsite: string
  companyName: string
  dealValue?: number
  stage: DealStage
}

export interface UpdateDealInput {
  name?: string
  dealValue?: number
  stage?: DealStage
  lastContactDate?: Date
}

export interface CreateStakeholderInput {
  fullName: string
  companyRole: string
  email: string
  linkedinUrl?: string
  buyerTypes: BuyerType[]
}

export interface UpdateStakeholderInput {
  fullName?: string
  companyRole?: string
  email?: string
  linkedinUrl?: string
  buyerTypes?: BuyerType[]
}

export interface CreateNextActionInput {
  description: string
  dueDate?: Date
  isAiSuggested?: boolean
}

export interface GeneratedContentData {
  // For Meeting Prep
  meetingPrep?: {
    content: string
    stakeholderNames: string[]
  }

  // For Email Sequence
  emailSequence?: {
    emails: {
      number: number
      subject: string
      body: string
      suggestedTiming: string
    }[]
  }

  // For Bundle
  bundle?: {
    email: {
      subject: string
      body: string
    }
    document: {
      type: 'case_study' | 'white_paper' | 'roi_calculator'
      content: string
    }
  }
}
