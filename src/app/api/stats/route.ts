import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Total entries
    const totalEntries = await db.trackerEntry.count()

    // Total categories
    const totalCategories = await db.trackerCategory.count()

    // Sum of all values
    const aggregates = await db.trackerEntry.aggregate({
      _sum: { value: true },
      _avg: { value: true },
      _max: { value: true },
      _min: { value: true },
    })

    // Entries per category
    const categoryStats = await db.trackerCategory.findMany({
      include: {
        _count: { select: { entries: true } },
        entries: {
          select: { value: true },
        },
      },
    })

    const categoryBreakdown = categoryStats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      entryCount: cat._count.entries,
      totalValue: cat.entries.reduce((sum, e) => sum + e.value, 0),
      avgValue: cat.entries.length > 0
        ? cat.entries.reduce((sum, e) => sum + e.value, 0) / cat.entries.length
        : 0,
    }))

    // Recent entries for activity feed
    const recentEntries = await db.trackerEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true },
    })

    // Entries grouped by date (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentWeek = await db.trackerEntry.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: 'asc' },
      select: { value: true, date: true, categoryId: true },
    })

    return NextResponse.json({
      totalEntries,
      totalCategories,
      totalValue: aggregates._sum.value || 0,
      avgValue: aggregates._avg.value || 0,
      maxValue: aggregates._max.value || 0,
      minValue: aggregates._min.value || 0,
      categoryBreakdown,
      recentEntries,
      weeklyTrend: recentWeek,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
