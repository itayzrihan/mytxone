import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { community, communityMember, user } from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

// GET /api/communities - Fetch all public communities or user's own communities
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // 'owned', 'joined', 'public'

    if (filter === "owned") {
      // User must be logged in to see owned communities
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = await db
        .select()
        .from(user)
        .where(eq(user.email, session.user.email))
        .limit(1);

      if (currentUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const ownedCommunities = await db
        .select({
          id: community.id,
          userId: community.userId,
          title: community.title,
          description: community.description,
          communityType: community.communityType,
          category: community.category,
          imageUrl: community.imageUrl,
          memberCount: sql<number>`cast(count(${communityMember.id}) as int)`,
          isPublic: community.isPublic,
          requiresApproval: community.requiresApproval,
          status: community.status,
          tags: community.tags,
          createdAt: community.createdAt,
          updatedAt: community.updatedAt,
        })
        .from(community)
        .leftJoin(communityMember, eq(community.id, communityMember.communityId))
        .where(eq(community.userId, currentUser[0].id))
        .groupBy(
          community.id,
          community.userId,
          community.title,
          community.description,
          community.communityType,
          community.category,
          community.imageUrl,
          community.isPublic,
          community.requiresApproval,
          community.status,
          sql`${community.tags}::text`,
          community.createdAt,
          community.updatedAt
        )
        .orderBy(desc(community.createdAt));

      console.log('GET /api/communities?filter=owned:', {
        userEmail: session.user.email,
        userId: currentUser[0].id,
        ownedCommunitiesCount: ownedCommunities.length,
      });

      return NextResponse.json(ownedCommunities);
    }

    if (filter === "joined") {
      // User must be logged in
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const currentUser = await db
        .select()
        .from(user)
        .where(eq(user.email, session.user.email))
        .limit(1);

      if (currentUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const joinedCommunities = await db
        .select({
          id: community.id,
          userId: community.userId,
          title: community.title,
          description: community.description,
          communityType: community.communityType,
          category: community.category,
          imageUrl: community.imageUrl,
          memberCount: sql<number>`cast(count(*) over (partition by ${community.id}) as int)`,
          isPublic: community.isPublic,
          requiresApproval: community.requiresApproval,
          status: community.status,
          tags: community.tags,
          createdAt: community.createdAt,
          updatedAt: community.updatedAt,
          membershipStatus: communityMember.membershipStatus,
          role: communityMember.role,
        })
        .from(communityMember)
        .innerJoin(community, eq(communityMember.communityId, community.id))
        .where(eq(communityMember.userId, currentUser[0].id))
        .orderBy(desc(community.createdAt));

      return NextResponse.json(joinedCommunities);
    }

    if (filter === "user") {
      // Fetch communities for a specific user (public only)
      const userId = searchParams.get("userId");
      const publicOnly = searchParams.get("publicOnly") === "true";

      if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
      }

      console.log('GET /api/communities?filter=user:', {
        userId,
        publicOnly,
      });

      const whereConditions: any[] = [eq(community.userId, userId)];
      
      if (publicOnly) {
        whereConditions.push(eq(community.isPublic, true));
      }

      const userCommunities = await db
        .select({
          id: community.id,
          userId: community.userId,
          title: community.title,
          description: community.description,
          communityType: community.communityType,
          category: community.category,
          imageUrl: community.imageUrl,
          memberCount: sql<number>`cast(count(${communityMember.id}) as int)`,
          isPublic: community.isPublic,
          requiresApproval: community.requiresApproval,
          status: community.status,
          tags: community.tags,
          createdAt: community.createdAt,
          updatedAt: community.updatedAt,
        })
        .from(community)
        .leftJoin(communityMember, eq(community.id, communityMember.communityId))
        .where(and(...whereConditions))
        .groupBy(
          community.id,
          community.userId,
          community.title,
          community.description,
          community.communityType,
          community.category,
          community.imageUrl,
          community.isPublic,
          community.requiresApproval,
          community.status,
          sql`${community.tags}::text`,
          community.createdAt,
          community.updatedAt
        )
        .orderBy(desc(community.createdAt));

      console.log('User communities found:', {
        count: userCommunities.length,
        communities: userCommunities.map(c => ({ id: c.id, title: c.title, userId: c.userId })),
      });

      return NextResponse.json(userCommunities);
    }

    // Default: return all public active communities
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    
    const whereConditions: any[] = [
      eq(community.isPublic, true),
      eq(community.status, "active")
    ];
    
    if (categories.length > 0) {
      whereConditions.push(inArray(community.category, categories));
    }
    
    const publicCommunities = await db
      .select({
        id: community.id,
        userId: community.userId,
        title: community.title,
        description: community.description,
        communityType: community.communityType,
        category: community.category,
        imageUrl: community.imageUrl,
        memberCount: sql<number>`cast(count(${communityMember.id}) as int)`,
        isPublic: community.isPublic,
        requiresApproval: community.requiresApproval,
        status: community.status,
        tags: community.tags,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
      })
      .from(community)
      .leftJoin(communityMember, eq(community.id, communityMember.communityId))
      .where(and(...whereConditions))
      .groupBy(
        community.id,
        community.userId,
        community.title,
        community.description,
        community.communityType,
        community.category,
        community.imageUrl,
        community.isPublic,
        community.requiresApproval,
        community.status,
        sql`${community.tags}::text`,
        community.createdAt,
        community.updatedAt
      )
      .orderBy(desc(community.createdAt));

    return NextResponse.json(publicCommunities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

// POST /api/communities - Create a new community
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const db = getDb();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = currentUser[0];

    // Check community creation limits based on subscription
    const existingCommunities = await db
      .select()
      .from(community)
      .where(
        and(
          eq(community.userId, userData.id),
          eq(community.status, "active") // Only count active communities
        )
      );

    console.log('=== CREATE COMMUNITY - EXISTING COUNT CHECK ===');
    console.log('User:', userData.email, 'ID:', userData.id);
    console.log('Plan:', userData.subscription);
    console.log('Existing active communities:', existingCommunities.length);
    console.log('=== END CHECK ===');

    const communityLimits = {
      free: 1,
      basic: 3,
      pro: Infinity,
    };

    const limit = communityLimits[userData.subscription as keyof typeof communityLimits] || 1;

    if (existingCommunities.length >= limit) {
      console.log('❌ LIMIT REACHED:', userData.email, 'has', existingCommunities.length, 'of', limit, 'communities');
      return NextResponse.json(
        {
          error: `Community limit reached. ${userData.subscription} plan allows ${limit === Infinity ? "unlimited" : limit} active communit${limit > 1 ? "ies" : "y"}. Please delete an old community or upgrade your plan.`,
          currentCount: existingCommunities.length,
          limit: limit === Infinity ? "unlimited" : limit,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      communityType,
      category,
      imageUrl,
      isPublic,
      requiresApproval,
      tags,
    } = body;

    if (!title || !communityType || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCommunity = await db
      .insert(community)
      .values({
        userId: userData.id,
        title,
        description: description || null,
        communityType,
        category,
        imageUrl: imageUrl || null,
        memberCount: 0,
        isPublic: isPublic ?? true,
        requiresApproval: requiresApproval ?? false,
        status: "active",
        tags: tags || null,
      })
      .returning();

    console.log('✅ COMMUNITY CREATED:', {
      communityId: newCommunity[0]?.id,
      title: newCommunity[0]?.title,
      userId: newCommunity[0]?.userId,
    });

    return NextResponse.json(newCommunity[0], { status: 201 });
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }
}
